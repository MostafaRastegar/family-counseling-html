import { notification } from 'antd';

export const copyToClipboard = (text: string, message?: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() =>
      notification.open({
        message: message ?? 'متن موردنظر کپی شد.',
        closable: true,
        placement: 'top',
        type: 'info',
      }),
    )
    .catch((reason) => console.log('error in copy text to clipboard', reason));
};
