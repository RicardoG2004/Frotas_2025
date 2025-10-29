import { ResponseApi } from '@/types/responses';

interface ErrorInfo {
  succeeded: boolean;
  messages: string | string[] | unknown;
}

export const getErrorMessage = (
  response: ResponseApi<ErrorInfo>,
  defaultMessage: string = 'Ocorreu um erro'
): string => {
  if (!response.info) return defaultMessage;

  const { messages } = response.info;

  if (Array.isArray(messages)) {
    return messages.join('\n• ');
  }

  if (typeof messages === 'string') {
    return messages;
  }

  if (typeof messages === 'object' && messages !== null) {
    const errors = Object.values(messages);
    if (errors.length > 0) {
      return '• ' + errors.flat().join('\n• ');
    }
  }

  return defaultMessage;
};

export const handleApiError = (
  error: unknown,
  defaultMessage: string = 'Ocorreu um erro'
): string => {
  console.log(error);
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'info' in error) {
    const apiResponse = error as ResponseApi<ErrorInfo>;
    return getErrorMessage(apiResponse, defaultMessage);
  }

  return defaultMessage;
};
