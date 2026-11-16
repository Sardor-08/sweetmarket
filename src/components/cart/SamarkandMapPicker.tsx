import React, { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ExternalLink, LocateFixed, MapPin, Search, ShieldCheck } from 'lucide-react';
import { Button, SelectInput, TextInput } from '../../design-system/ui';
import { useTranslation } from '../../hooks/useTranslation';
import { GeoCoordinates } from '../../types';

interface SamarkandMapPickerProps {
  districtId: string;
  onDistrictChange: (districtId: string) => void;
  address: string;
  onAddressChange: (address: string) => void;
  street: string;
  onStreetChange: (street: string) => void;
  houseNumber: string;
  onHouseNumberChange: (houseNumber: string) => void;
  apartmentCode: string;
  onApartmentCodeChange: (code: string) => void;
  courierNote: string;
  onCourierNoteChange: (note: string) => void;
  customerPhone: string;
  onCustomerPhoneChange: (phone: string) => void;
  coordinates?: GeoCoordinates;
  onCoordinatesChange?: (coords: GeoCoordinates) => void;
}

interface SamarkandDistrictZone {
  id: string;
  nameUz: string;
  nameRu: string;
  shortUz: string;
  shortRu: string;
  lat: number;
  lng: number;
}

const SAMARKAND_CENTER: GeoCoordinates = { lat: 39.6542, lng: 66.9597 };

const SAMARKAND_DISTRICTS: SamarkandDistrictZone[] = [
  {
    id: 'registon',
    nameUz: 'Registon markazi',
    nameRu: 'Центр / Регистан',
    shortUz: 'Registon',
    shortRu: 'Регистан',
    lat: 39.6548,
    lng: 66.9756,
  },
  {
    id: 'universitet',
    nameUz: 'Universitet xiyoboni',
    nameRu: 'Университетский бульвар',
    shortUz: 'Universitet',
    shortRu: 'Университет',
    lat: 39.6484,
    lng: 66.9602,
  },
  {
    id: 'siyob',
    nameUz: 'Siyob bozori',
    nameRu: 'Сиабский базар',
    shortUz: 'Siyob',
    shortRu: 'Сиаб',
    lat: 39.6609,
    lng: 66.9854,
  },
  {
    id: 'sartepa',
    nameUz: 'Sartepa massivi',
    nameRu: 'Сартепа',
    shortUz: 'Sartepa',
    shortRu: 'Сартепа',
    lat: 39.6352,
    lng: 66.9175,
  },
  {
    id: 'sogdiana',
    nameUz: 'So‘g‘diyona',
    nameRu: 'Согдиана',
    shortUz: 'So‘g‘diyona',
    shortRu: 'Согдиана',
    lat: 39.6675,
    lng: 66.9248,
  },
];

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    pedestrian?: string;
    residential?: string;
    neighbourhood?: string;
    suburb?: string;
    house_number?: string;
    city_district?: string;
  };
}

function haversineKm(a: GeoCoordinates, b: GeoCoordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function findNearestDistrictId(coords: GeoCoordinates): string {
  let nearest = SAMARKAND_DISTRICTS[0];
  let bestDist = Infinity;
  for (const zone of SAMARKAND_DISTRICTS) {
    const d = haversineKm(coords, { lat: zone.lat, lng: zone.lng });
    if (d < bestDist) {
      bestDist = d;
      nearest = zone;
    }
  }
  return nearest.id;
}

function createPinIcon(): L.DivIcon {
  return L.divIcon({
    className: 'sweetmarket-map-pin',
    html: `<div style="width:28px;height:28px;border-radius:9999px;background:#c95d3a;border:3px solid #ffffff;box-shadow:0 4px 12px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;transform:translate(-50%,-50%);"><div style="width:8px;height:8px;border-radius:9999px;background:#ffffff;"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export function SamarkandMapPicker({
  districtId,
  onDistrictChange,
  onAddressChange,
  street,
  onStreetChange,
  houseNumber,
  onHouseNumberChange,
  apartmentCode,
  onApartmentCodeChange,
  courierNote,
  onCourierNoteChange,
  customerPhone,
  onCustomerPhoneChange,
  coordinates,
  onCoordinatesChange,
}: SamarkandMapPickerProps) {
  const { locale } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const initialCoords = coordinates ?? SAMARKAND_CENTER;
  const [pinCoords, setPinCoords] = useState<GeoCoordinates>(initialCoords);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<{
    tone: 'info' | 'success' | 'warning';
    text: string;
  } | null>(null);

  const callbacksRef = useRef({
    onDistrictChange,
    onAddressChange,
    onStreetChange,
    onHouseNumberChange,
    onCoordinatesChange,
    locale,
  });
  callbacksRef.current = {
    onDistrictChange,
    onAddressChange,
    onStreetChange,
    onHouseNumberChange,
    onCoordinatesChange,
    locale,
  };

  const reverseGeocode = useCallback(async (coords: GeoCoordinates) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1&accept-language=${callbacksRef.current.locale},ru,en`;
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return;
      const data = (await res.json()) as NominatimResult;
      const addr = data.address;
      if (addr) {
        const roadName =
          addr.road ||
          addr.pedestrian ||
          addr.residential ||
          addr.neighbourhood ||
          addr.suburb ||
          addr.city_district ||
          '';
        if (roadName) {
          callbacksRef.current.onStreetChange(roadName);
        }
        if (addr.house_number) {
          callbacksRef.current.onHouseNumberChange(addr.house_number);
        }
        if (data.display_name) {
          callbacksRef.current.onAddressChange(data.display_name);
        }
      }
    } catch {
      // Keep user's manual fields if offline / rate-limited
    }
  }, []);

  const applyCoordinates = useCallback(
    (nextCoords: GeoCoordinates, options?: { panZoom?: number; shouldReverse?: boolean }) => {
      setPinCoords(nextCoords);
      callbacksRef.current.onCoordinatesChange?.(nextCoords);
      const nearestId = findNearestDistrictId(nextCoords);
      callbacksRef.current.onDistrictChange(nearestId);

      if (markerRef.current) {
        markerRef.current.setLatLng([nextCoords.lat, nextCoords.lng]);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView(
          [nextCoords.lat, nextCoords.lng],
          options?.panZoom ?? Math.max(mapInstanceRef.current.getZoom(), 15),
          { animate: true },
        );
      }
      if (options?.shouldReverse !== false) {
        void reverseGeocode(nextCoords);
      }
    },
    [reverseGeocode],
  );

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || mapInstanceRef.current) return;

    const map = L.map(container, {
      center: [initialCoords.lat, initialCoords.lng],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    // Visual delivery boundary around Samarkand City
    L.circle([SAMARKAND_CENTER.lat, SAMARKAND_CENTER.lng], {
      radius: 8500,
      color: '#c95d3a',
      weight: 1.5,
      dashArray: '6 6',
      fillColor: '#c95d3a',
      fillOpacity: 0.05,
    }).addTo(map);

    const marker = L.marker([initialCoords.lat, initialCoords.lng], {
      draggable: true,
      icon: createPinIcon(),
    }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      const coords = { lat: Number(pos.lat.toFixed(6)), lng: Number(pos.lng.toFixed(6)) };
      setGpsStatus({
        tone: 'success',
        text:
          callbacksRef.current.locale === 'uz'
            ? `Nuqta xaritada belgilandi (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`
            : `Точка отмечена на карте (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`,
      });
      applyCoordinates(coords);
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      const coords = { lat: Number(e.latlng.lat.toFixed(6)), lng: Number(e.latlng.lng.toFixed(6)) };
      setGpsStatus({
        tone: 'success',
        text:
          callbacksRef.current.locale === 'uz'
            ? `Manzil nuqtasi tanlandi (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`
            : `Точка доставки выбрана (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`,
      });
      applyCoordinates(coords);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 180);

    return () => {
      window.clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [applyCoordinates, initialCoords.lat, initialCoords.lng]);

  const handleSelectZone = (zone: SamarkandDistrictZone) => {
    const coords = { lat: zone.lat, lng: zone.lng };
    onDistrictChange(zone.id);
    setPinCoords(coords);
    onCoordinatesChange?.(coords);
    if (markerRef.current) markerRef.current.setLatLng([zone.lat, zone.lng]);
    if (mapInstanceRef.current) mapInstanceRef.current.setView([zone.lat, zone.lng], 15, { animate: true });
    setGpsStatus({
      tone: 'info',
      text:
        locale === 'uz'
          ? `${zone.nameUz} hududiga ko‘chirildi. Aniq uy uchun xaritaga bosing.`
          : `Карта перемещена в ${zone.nameRu}. Нажмите на ваш дом.`,
    });
    void reverseGeocode(coords);
  };

  const handleSearchAddress = async () => {
    const q = searchQuery.trim();
    if (q.length < 2) return;
    setIsSearching(true);
    setSearchResults([]);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&viewbox=66.82,39.74,67.08,39.56&bounded=1&q=${encodeURIComponent(`${q}, Samarkand, Uzbekistan`)}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Search failed');
      const items = (await res.json()) as NominatimResult[];
      setSearchResults(items);
      if (items.length === 0) {
        setGpsStatus({
          tone: 'warning',
          text:
            locale === 'uz'
              ? 'Samarqand bo‘yicha aniq moslik topilmadi. Xaritada nuqtani qo‘lda bosing.'
              : 'Точный адрес в Самарканде не найден. Отметьте точку на карте вручную.',
        });
      }
    } catch {
      setGpsStatus({
        tone: 'warning',
        text:
          locale === 'uz'
            ? 'Qidiruv vaqtincha javob bermadi. Xaritadan nuqtani belgilang.'
            : 'Поиск временно недоступен. Отметьте точку на карте.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handlePickSearchResult = (item: NominatimResult) => {
    const coords = {
      lat: Number(Number(item.lat).toFixed(6)),
      lng: Number(Number(item.lon).toFixed(6)),
    };
    setSearchResults([]);
    setSearchQuery(item.display_name.split(',')[0] ?? '');
    const road =
      item.address?.road ||
      item.address?.pedestrian ||
      item.address?.residential ||
      item.display_name.split(',')[0] ||
      '';
    if (road) onStreetChange(road);
    if (item.address?.house_number) onHouseNumberChange(item.address.house_number);
    onAddressChange(item.display_name);
    setGpsStatus({
      tone: 'success',
      text:
        locale === 'uz'
          ? `Topildi: ${item.display_name.split(',').slice(0, 2).join(', ')}`
          : `Найдено: ${item.display_name.split(',').slice(0, 2).join(', ')}`,
    });
    applyCoordinates(coords, { panZoom: 16, shouldReverse: false });
  };

  const tryIpLocationFallback = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/', { headers: { Accept: 'application/json' } });
      if (!res.ok) return false;
      const data = (await res.json()) as { latitude?: number; longitude?: number; city?: string };
      if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        const distKm = haversineKm({ lat: data.latitude, lng: data.longitude }, SAMARKAND_CENTER);
        if (distKm <= 25) {
          const coords = { lat: Number(data.latitude.toFixed(6)), lng: Number(data.longitude.toFixed(6)) };
          setGpsStatus({
            tone: 'success',
            text:
              locale === 'uz'
                ? 'Joylashuv tarmoq orqali Samarqandda aniqlandi. Aniq uyni belgilang.'
                : 'Локация определена по сети в Самарканде. Уточните дом на карте.',
          });
          applyCoordinates(coords, { panZoom: 15 });
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleDetectGps = () => {
    setIsLocating(true);
    setGpsStatus({
      tone: 'info',
      text:
        locale === 'uz'
          ? 'Joylashuvingiz aniqlanmoqda...'
          : 'Определение вашего местоположения...',
    });

    if (!navigator.geolocation) {
      void tryIpLocationFallback().then((ok) => {
        setIsLocating(false);
        if (!ok) {
          setGpsStatus({
            tone: 'warning',
            text:
              locale === 'uz'
                ? 'Brauzer GPS bermadi — xaritaga bosing yoki ko‘chani qidiring.'
                : 'GPS недоступен — нажмите на карту или найдите улицу.',
          });
        }
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const coords = {
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
        };
        const accuracyM = Math.round(position.coords.accuracy || 15);
        const distanceFromSamarkandKm = haversineKm(coords, SAMARKAND_CENTER);

        if (distanceFromSamarkandKm > 25) {
          setGpsStatus({
            tone: 'warning',
            text:
              locale === 'uz'
                ? `GPS koordinatangiz Samarqand hududidan tashqarida (${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)}). Yetkazib berish nuqtasini Samarqand xaritasidan tanlang.`
                : `Ваши координаты вне зоны доставки Самарканда (${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)}). Выберите точку на карте Самарканда.`,
          });
          return;
        }

        setGpsStatus({
          tone: 'success',
          text:
            locale === 'uz'
              ? `Joylashuv aniqlandi (±${accuracyM} m). Nuqtani surib aniqlashtirishingiz mumkin.`
              : `Местоположение определено (±${accuracyM} м). Можно подвинуть метку.`,
        });
        applyCoordinates(coords, { panZoom: 17 });
      },
      async () => {
        const ipOk = await tryIpLocationFallback();
        setIsLocating(false);
        if (!ipOk) {
          setGpsStatus({
            tone: 'warning',
            text:
              locale === 'uz'
                ? 'Brauzer/oyna GPS ruxsatini blokladi. Yuqoridagi qidiruvdan foydalaning yoki xaritaga bosing.'
                : 'Браузер заблокировал GPS. Используйте поиск выше или нажмите на карту.',
          });
        }
      },
      { timeout: 6000, enableHighAccuracy: true, maximumAge: 30000 },
    );
  };

  const yandexMapsUrl = `https://yandex.uz/maps/?pt=${pinCoords.lng},${pinCoords.lat}&z=17&l=map`;

  return (
    <div className="rounded-[14px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[var(--sm-accent-primary)] shrink-0" aria-hidden="true" />
          <h3 className="font-display text-base font-semibold text-[var(--sm-text-primary)]">
            {locale === 'uz' ? 'Samarqand shahri xaritasi' : 'Карта города Самарканд'}
          </h3>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDetectGps}
          isLoading={isLocating}
          leftIcon={<LocateFixed className="w-3.5 h-3.5 text-[var(--sm-accent-primary)]" />}
        >
          {locale === 'uz' ? 'Mening joylashuvim' : 'Моё местоположение'}
        </Button>
      </div>

      {/* Address Search Inside Samarkand */}
      <div className="relative space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--sm-text-muted)]"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void handleSearchAddress();
                }
              }}
              placeholder={
                locale === 'uz'
                  ? 'Ko‘cha, uy yoki mo‘ljal qidiring (masalan: Rudakiy 45)'
                  : 'Поиск улицы или ориентира (например: Рудаки 45)'
              }
              className="h-9 w-full rounded-[8px] border border-[var(--sm-border-strong)] bg-[var(--sm-bg-elevated)] pl-8 pr-3 text-xs text-[var(--sm-text-primary)] placeholder:text-[var(--sm-text-muted)] focus:outline-none focus:border-[var(--sm-accent-primary)]"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            isLoading={isSearching}
            onClick={() => void handleSearchAddress()}
          >
            {locale === 'uz' ? 'Topish' : 'Найти'}
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="rounded-[8px] border border-[var(--sm-border-strong)] bg-[var(--sm-bg-elevated)] divide-y divide-[var(--sm-border-subtle)] max-h-40 overflow-y-auto shadow-md">
            {searchResults.map((item) => (
              <button
                key={item.place_id}
                type="button"
                onClick={() => handlePickSearchResult(item)}
                className="w-full text-left px-3 py-2 text-xs text-[var(--sm-text-primary)] hover:bg-[var(--sm-bg-subtle)] cursor-pointer transition-colors"
              >
                {item.display_name}
              </button>
            ))}
          </div>
        )}

        {/* Quick Samarkand City Zone Jumps */}
        <div className="flex flex-wrap items-center gap-1.5">
          {SAMARKAND_DISTRICTS.map((zone) => {
            const active = districtId === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => handleSelectZone(zone)}
                className={[
                  'rounded-[6px] border px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer',
                  active
                    ? 'border-[var(--sm-accent-primary)] bg-[var(--sm-accent-primary-soft)] text-[var(--sm-accent-primary)]'
                    : 'border-[var(--sm-border-subtle)] bg-[var(--sm-bg-elevated)] text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)]',
                ].join(' ')}
              >
                {locale === 'uz' ? zone.shortUz : zone.shortRu}
              </button>
            );
          })}
        </div>
      </div>

      {/* Real Interactive Leaflet Map */}
      <div className="relative rounded-[10px] border border-[var(--sm-border-subtle)] overflow-hidden bg-[var(--sm-bg-subtle)]">
        <div ref={mapContainerRef} className="h-64 w-full z-0" />
      </div>

      {/* Coordinates & External Yandex Maps Link */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <span className="font-mono tabular-nums text-[var(--sm-text-muted)]">
          {pinCoords.lat.toFixed(5)}, {pinCoords.lng.toFixed(5)}
        </span>
        <a
          href={yandexMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-[var(--sm-accent-primary)] hover:underline"
        >
          <span>{locale === 'uz' ? 'Yandex Maps’da ochish' : 'Открыть в Яндекс Картах'}</span>
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>

      {gpsStatus && (
        <p
          className={[
            'rounded-[8px] border px-3 py-2 text-[11px] font-medium',
            gpsStatus.tone === 'success'
              ? 'border-[var(--sm-status-success)]/35 bg-[var(--sm-status-success)]/10 text-[var(--sm-status-success)]'
              : gpsStatus.tone === 'warning'
              ? 'border-[var(--sm-status-warning)]/40 bg-[var(--sm-status-warning)]/10 text-[var(--sm-text-primary)]'
              : 'border-[var(--sm-border-subtle)] bg-[var(--sm-bg-subtle)] text-[var(--sm-text-secondary)]',
          ].join(' ')}
        >
          {gpsStatus.text}
        </p>
      )}

      {/* Structured Address Form Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <SelectInput
          label={locale === 'uz' ? 'Samarqand shahri hududi' : 'Район города Самарканд'}
          value={districtId}
          onChange={(e) => {
            const nextId = e.target.value;
            onDistrictChange(nextId);
            const zone = SAMARKAND_DISTRICTS.find((z) => z.id === nextId);
            if (zone) handleSelectZone(zone);
          }}
          options={SAMARKAND_DISTRICTS.map((d) => ({
            value: d.id,
            label: locale === 'uz' ? d.nameUz : d.nameRu,
          }))}
        />
        <TextInput
          label={locale === 'uz' ? 'Ko‘cha nomi' : 'Название улицы'}
          placeholder={locale === 'uz' ? 'Masalan: Registon ko‘chasi' : 'Например: ул. Регистан'}
          value={street}
          onChange={(e) => onStreetChange(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TextInput
          label={locale === 'uz' ? 'Uy raqami' : 'Номер дома'}
          placeholder="28"
          value={houseNumber}
          onChange={(e) => onHouseNumberChange(e.target.value)}
          required
        />
        <TextInput
          label={locale === 'uz' ? 'Xonadon / Pod’ezd / Kod' : 'Квартира / Подъезд / Код'}
          placeholder={locale === 'uz' ? '3-podyezd, 4-qavat' : 'под. 3, эт. 4'}
          value={apartmentCode}
          onChange={(e) => onApartmentCodeChange(e.target.value)}
        />
        <TextInput
          label={locale === 'uz' ? 'Bog‘lanish telefoni' : 'Телефон для связи'}
          placeholder="+998 90 123 45 67"
          value={customerPhone}
          onChange={(e) => onCustomerPhoneChange(e.target.value)}
          required
        />
      </div>

      <TextInput
        label={locale === 'uz' ? 'Kuryer uchun maxsus izoh' : 'Комментарий для курьера'}
        placeholder={
          locale === 'uz'
            ? 'Masalan: Kelishdan 15 daqiqa oldin qo‘ng‘iroq qiling'
            : 'Например: позвонить за 15 минут до приезда'
        }
        value={courierNote}
        onChange={(e) => onCourierNoteChange(e.target.value)}
      />

      <div className="flex items-center gap-2 rounded-[8px] bg-[var(--sm-bg-subtle)] px-3 py-2 text-[11px] text-[var(--sm-text-muted)]">
        <ShieldCheck className="w-4 h-4 text-[var(--sm-accent-primary)] shrink-0" />
        <span>
          {locale === 'uz'
            ? 'Xaritadagi nuqta va manzilingiz buyurtma bilan kuryerga yuboriladi, topshirishda maxsus PIN-kod ishlatiladi.'
            : 'Точка на карте передаётся курьеру, при передаче заказа используется специальный PIN-код.'}
        </span>
      </div>
    </div>
  );
}
