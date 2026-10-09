import type { MenuItem, Restaurant } from './store/AppState';

export const C = {
  teal: '#78D5D7',
  tealDeep: '#56C2C5',
  ink: '#122B3A',
  screen: '#F7FBFB',
  card: '#FFFFFF',
  line: '#D9E9E9',
  muted: '#6F858C',
  darkMuted: '#263941',
  accent: '#4EBCC0',
  yellow: '#FFD45A',
  softTeal: '#DDF6F6',
  frame: '#11242D',
};

export const RESTAURANTS: Restaurant[] = [
  { id: 'urban', name: 'Urban Bites', tags: 'Burgers • American', rating: '4.8', time: '20–25 min', fee: '$1.99', dist: '0.8 km', img: require('../assets/images/discover-urban-bites.png'), cat: 'Burgers' },
  { id: 'green', name: 'Green Bowl', tags: 'Healthy • Vegan', rating: '4.7', time: '15–20 min', fee: 'Free', dist: '1.2 km', img: require('../assets/images/discover-green-bowl.png'), cat: 'Asian' },
  { id: 'fire', name: 'Fire Chicken', tags: 'Korean • Chicken', rating: '4.9', time: '25–30 min', fee: '$0.99', dist: '1.6 km', img: require('../assets/images/discover-fire-chicken.png'), cat: 'Chicken' },
  { id: 'noodle', name: 'Noodle House', tags: 'Asian • Noodles', rating: '4.6', time: '20–30 min', fee: '$1.49', dist: '2.1 km', img: require('../assets/images/discover-noodle-house.png'), cat: 'Asian' },
  
];

export const HOME_IMGS: Record<string, any> = {
  urban: require('../assets/images/home-urban-bites.png'),
  green: require('../assets/images/home-green-bowl.png'),
};

export const MENU: MenuItem[] = [
  { id: 'smash', name: 'Classic Smash', desc: 'Double beef, cheddar, pickles, house sauce', price: 12.9, img: require('../assets/images/menu-classic-smash.png'), cat: 'Burgers' },
  { id: 'chicken', name: 'Crispy Chicken', desc: 'Buttermilk chicken, slaw, hot honey', price: 11.5, img: require('../assets/images/menu-crispy-chicken.png'), cat: 'Burgers' },
  { id: 'fries', name: 'Truffle Fries', desc: 'Parmesan, herbs, truffle aioli', price: 5.9, img: require('../assets/images/menu-truffle-fries.png'), cat: 'Sides' },
];

export const AVATAR = require('../assets/images/leandro_profile.jpg');
export const COURIER = require('../assets/images/courier-maya.png');
export const MENU_HEADER = require('../assets/images/menu-header.png');
export const DETAILS_HERO = require('../assets/images/details-hero.png');

export const money = (n: number) => '$' + n.toFixed(2);
