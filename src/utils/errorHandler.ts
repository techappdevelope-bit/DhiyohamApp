import Toast from 'react-native-toast-message';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public userMessage?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: any, context?: string) => {
  console.error(`Error in ${context || 'app'}:`, error);

  let userMessage = 'Something went wrong. Please try again.';

  if (error instanceof AppError) {
    userMessage = error.userMessage || error.message;
  } else if (error.message) {
    userMessage = error.message;
  }

  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: userMessage,
    visibilityTime: 4000,
  });
};

export const handleSuccess = (message: string, subtitle?: string) => {
  Toast.show({
    type: 'success',
    text1: message,
    text2: subtitle,
    visibilityTime: 3000,
  });
};

export const handleInfo = (message: string, subtitle?: string) => {
  Toast.show({
    type: 'info',
    text1: message,
    text2: subtitle,
    visibilityTime: 3000,
  });
};
