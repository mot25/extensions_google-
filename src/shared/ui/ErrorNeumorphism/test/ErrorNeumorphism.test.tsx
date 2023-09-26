import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { ErrorNeumorphism } from '../ui/ErrorNeumorphism';

describe('ErrorNeumorphism', () => {
  const errorList = ['errorTest1', 'errorTest2'];
  test('если пришли массив ошибок', () => {
    render(<ErrorNeumorphism errorsCopy={errorList} />);
    errorList.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});
