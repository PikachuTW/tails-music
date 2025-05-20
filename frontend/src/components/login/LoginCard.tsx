import React from 'react';
import CopyIcon from '../icons/CopyIcon';

interface LoginCardProps {
  code: string;
  isLoading: boolean;
  onCopy: (textToCopy: string, message: string, type?: string) => void;
}

const LoginCard: React.FC<LoginCardProps> = ({ code, isLoading, onCopy }) => {
  const textToCopy = `tm!login ${code}`;

  const isDisabled =
    isLoading || !code || code === '----' || code === '錯誤' || code === '離線';

  const handleCopy = async () => {
    if (!isDisabled) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        onCopy(textToCopy, '已複製到剪貼簿!', 'alert-success');
      } catch (err) {
        console.error('Failed to copy: ', err);
        onCopy(textToCopy, '複製失敗', 'alert-error');
      }
    } else {
      onCopy('', '登入碼尚未載入或無效。', 'alert-warning');
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-2xl font-bold">歡迎回來</h2>
        <div className="divider">您的登入碼</div>
        <div
          id="login-code-display"
          className="text-5xl font-bold text-primary mb-4"
        >
          {isLoading ? '載入中...' : code}
        </div>
        <div className="bg-base-200 p-3 rounded-lg w-full">
          <p className="text-sm">請在Discord輸入以下指令來登入：</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <code
              id="login-command"
              className="badge badge-primary badge-lg p-3 font-mono"
            >
              {isDisabled ? `tm!login ----` : textToCopy}
            </code>
            <button
              id="copy-button"
              className="btn btn-circle btn-xs btn-ghost"
              onClick={handleCopy}
              disabled={isDisabled}
            >
              <CopyIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
