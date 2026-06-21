import { CATEGORIES } from '../services/productService';

export const navbar = [
  {
    id: 1,
    path: '/',
    nav: 'Home',
  },
  {
    id: 2,
    path: '/about',
    nav: 'About',
  },
  {
    id: 3,
    path: '/shop',
    nav: 'Shop',
  },
  {
    id: 4,
    path: '/cart',
    nav: 'Cart',
  },
  {
    id: 5,
    path: '/login',
    nav: 'Login',
  },
  {
    id: 6,
    path: '/contact',
    nav: 'Contact',
  },
];

export const banners = [
  {
    banner: '/images/banner7.jpg',
  },
  {
    banner: '/images/banner5.jpg',
  },
  {
    banner: '/images/banner8.jpg',
  },
];

export const bannar_down = [
  {
    img: '/images/ban21.jpg',
    name: 'BIKES',
    category: CATEGORIES.BIKES,
  },
  {
    img: '/images/ban22.jpg',
    name: 'PARTS',
    category: CATEGORIES.PARTS,
  },
  {
    img: '/images/ban23.jpg',
    name: 'REPAIRS',
    category: CATEGORIES.REPAIRS,
  },
];

export const reviews = [
  {
    title: 'Customer Review',
    description:
      'Freewheel Bikes fixed my mountain bike in just a few hours. The mechanics are professional, friendly, and clearly passionate about cycling. I highly recommend their service to every cyclist!',
    customer_img: '/images/testi1.jpg',
    customer_name: 'Joanne Lee',
    position: 'Mountain Bike Enthusiast',
  },

  {
    title: 'Customer Review',
    description:
      'I bought my road bike from Freewheel Bikes and the experience was fantastic. The staff helped me find exactly the right bike for my needs and budget. The online shop makes ordering parts easy too.',
    customer_img: '/images/testi2.jpg',
    customer_name: 'Maria Garcia',
    position: 'Road Cyclist',
  },

  {
    title: 'Customer Review',
    description:
      "Best bike shop in Tampere! They serviced my old commuter and it rides like new. Fair prices, honest advice, and quick turnaround. I won't take my bike anywhere else.",
    customer_img: '/images/testi3.jpg',
    customer_name: 'George Brown',
    position: 'Commuter Cyclist',
  },
];

export const blogs = [
  {
    id: 1,
    img: '/images/ban21.jpg',
    tag: '8 May',
    title: 'How to choose the right bike',
    short_description:
      'Choosing your first or next bike can be overwhelming. Here is everything you need to know ...',
    read_more: 'Read More',
  },
  {
    id: 2,
    img: '/images/ban22.jpg',
    tag: '10 May',
    title: 'Essential bike maintenance tips',
    short_description: 'Keep your bike running smoothly all season with these maintenance tips ...',
    read_more: 'Read More',
  },
  {
    id: 3,
    img: '/images/ban21.jpg',
    tag: '20 May',
    title: 'Best cycling routes in Tampere',
    short_description: 'Discover the best routes for cyclists of all levels around Tampere ...',
    read_more: 'Read More',
  },
  {
    id: 4,
    img: '/images/ban22.jpg',
    tag: '30 May',
    title: 'Road vs Mountain bike: which suits you?',
    short_description: 'Not sure which type of bike fits your riding style? We break it all down ...',
    read_more: 'Read More',
  },
  {
    id: 5,
    img: '/images/ban23.jpg',
    tag: '1 June',
    title: 'Winter cycling in Finland',
    short_description: 'Cycling year-round in Finland is possible with the right gear and mindset ...',
    read_more: 'Read More',
  },
];

export const footer = [
  {
    id: 2,
    header: 'Contact Us',
    content3: 'Finlaysoninkatu 25, Tampere',
    content4: 'info@freewheelbikes.fi',
    content5: '+358 50 123 4567',
  },
  {
    id: 3,
    header: 'Services',
    content1: 'Bike Repairs',
    content2: 'Full Service Package',
    content3: 'Custom Builds',
    content4: 'Gear & Brake Tuning',
  },
  {
    id: 4,
    header: 'My Account',
    content1: 'My Orders',
    content2: 'Payments',
    content3: 'Account Settings',
  },
  {
    id: 5,
    header: 'Opening Hours',
    content1: 'Mon–Fri: 10–19',
    content2: 'Saturday: 10–17',
    content3: 'Sunday: 12–16',
  },
];
