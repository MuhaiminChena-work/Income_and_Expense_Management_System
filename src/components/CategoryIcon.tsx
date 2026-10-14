import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Home,
  Film,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  Banknote,
  Store,
  Laptop,
  Award,
  TrendingUp,
  Gift,
  ArrowDownLeft,
  ArrowUpRight,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Utensils':
      return <Utensils {...props} />;
    case 'Car':
      return <Car {...props} />;
    case 'ShoppingBag':
      return <ShoppingBag {...props} />;
    case 'Receipt':
      return <Receipt {...props} />;
    case 'Home':
      return <Home {...props} />;
    case 'Film':
      return <Film {...props} />;
    case 'HeartPulse':
      return <HeartPulse {...props} />;
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'Banknote':
      return <Banknote {...props} />;
    case 'Store':
      return <Store {...props} />;
    case 'Laptop':
      return <Laptop {...props} />;
    case 'Award':
      return <Award {...props} />;
    case 'TrendingUp':
      return <TrendingUp {...props} />;
    case 'Gift':
      return <Gift {...props} />;
    case 'ArrowDownLeft':
      return <ArrowDownLeft {...props} />;
    case 'ArrowUpRight':
      return <ArrowUpRight {...props} />;
    case 'MoreHorizontal':
      return <MoreHorizontal {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};
