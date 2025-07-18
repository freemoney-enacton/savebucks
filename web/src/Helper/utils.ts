import { config } from '@/config';

export const formattedFloatCurrency = (amount: any) => {
  // Extract the first character as the currency symbol
  const currencySymbol = amount.charAt(0);

  // Extract the numeric part of the string
  const numericPart = amount.slice(1);

  // Convert the numeric part to a floating-point number
  const amountValue = parseFloat(numericPart);

  // Check if the amount is a valid number
  if (isNaN(amountValue)) {
    throw new Error('Invalid numeric value in amount string');
  }

  // Format the amount to 2 decimal places
  const formattedAmount = amountValue.toFixed(2);

  // Reattach the currency symbol and return the result
  return `${currencySymbol}${formattedAmount}`;
};

export const setUserEmailInOneSignal = (data) => {
  //@ts-ignore
  // window.OneSignal.login(data?.user?.user?.id.toString());
  // data?.user?.user?.email
  //   ? //@ts-ignore
  //     window.OneSignal.User.addEmail(data?.user?.user?.email)
  //   : //@ts-ignore
  //     window.OneSignal.User.addEmail(data?.user?.user?.phone_no);
};
export const removeUserEmailFromOneSignal = () => {
  //@ts-ignore
  // window.OneSignal.logout();
};

export function deleteAllCookies() {
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

    // Skip deleting specific cookie
    if (name.toLowerCase() === config.IS_MOBILE_COOKIE.trim().toLowerCase()) {
      continue;
    }

    // Delete cookie on root path
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;

    // Delete cookie with other common paths (just in case)
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
  }
}

// temporary fetch function remove this later
export const fetchData = async <T>(url: string, options?: RequestInit): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
};

export function setHeightAsCSSVariable(selector: any, variableName: any) {
  const element = document.querySelector(selector);
  if (element) {
    const height = element.offsetHeight; // Get the element's height
    document.documentElement.style.setProperty(`--${variableName}`, `${height}px`); // Set the CSS variable
  }
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
