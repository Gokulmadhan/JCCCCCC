import React from 'react'
import { Link } from 'react-router-dom';

export default function CategoryMenu() {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-6">
      {[
        { name: 'Men', path: '/men' },
        { name: 'Women', path: '/women' },
        { name: 'Inner Wear', path: '/inner-wear' },
        { name: 'Tops', path: '/tops' },
        { name: 'Bottoms', path: '/bottoms' },
        { name: 'Vests', path: '/vests' },
        { name: 'Cruise Super Pack', path: '/cruise-super-pack' },
      ].map((category) => (
        <Link
          key={category.name}
          to={category.path}
          className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm hover:bg-pink-200 transition"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
