import bentoCakeImg from './images/product_bento_pistachio_cake_1794591194984.jpg';
import berryTartImg from './images/product_sugar_free_berry_tart_1794591196478.jpg';
import celebrationCakeImg from './images/artisan_celebration_cake_1794590402664.jpg';
import eclairsImg from './images/product_eclair_assortment_1794591197539.jpg';
import halvaImg from './images/product_samarkand_halva_nougat_1794591196690.jpg';
import heroPastryImg from './images/hero_samarkand_pastry_1794590401147.jpg';
import macaronsImg from './images/product_macaron_gift_box_1794591196497.jpg';
import medovikImg from './images/product_saffron_medovik_1794591196156.jpg';
import trufflesImg from './images/artisan_chocolate_truffles_1794590401324.jpg';
import { ProductMediaKey } from '../types';

export const PRODUCT_MEDIA_MAP: Record<ProductMediaKey, string> = {
  hero_pastry: heroPastryImg,
  truffles: trufflesImg,
  celebration_cake: celebrationCakeImg,
  bento_cake: bentoCakeImg,
  macarons: macaronsImg,
  medovik: medovikImg,
  halva: halvaImg,
  berry_tart: berryTartImg,
  eclairs: eclairsImg,
};
