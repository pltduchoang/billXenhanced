
import React from 'react';
import AccountCreditCardOutline from '../../icons/account/account-credit-card-outline.svg';
import Cash from '../../icons/account/cash.svg';
import Checkbook from '../../icons/account/checkbook.svg';
import CreditCardOutline from '../../icons/account/credit-card-outline.svg';
import Finance from '../../icons/account/finance.svg';
import InvoiceTextOutline from '../../icons/account/invoice-text-outline.svg';
import Safe from '../../icons/account/safe.svg';
import WalletBifoldOutline from '../../icons/account/wallet-bifold-outline.svg';

const AccountIconLibrary = {
    'account-credit-card-outline': AccountCreditCardOutline,
    'cash': Cash,
    'checkbook': Checkbook,
    'credit-card-outline': CreditCardOutline,
    'finance': Finance,
    'invoice-text-outline': InvoiceTextOutline,
    'safe': Safe,
    'wallet-bifold-outline': WalletBifoldOutline,
};

export const getAccountIcon = (iconName, size = 30, color = '#DDF2FD') => {
  const IconComponent = AccountIconLibrary[iconName];
  return IconComponent ? <IconComponent width={size} height={size} fill={color} /> : null;
};

