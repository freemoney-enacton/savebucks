import { SurveyProviderType } from '@/Type/Provider';
import React from 'react';

export default function ProviderCard({ item }: { item: SurveyProviderType }) {
  return <div>{item.name}</div>;
}
