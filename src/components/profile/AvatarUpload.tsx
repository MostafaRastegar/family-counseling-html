import React, { useState } from 'react';
import {
  CameraOutlined,
  LoadingOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Modal,
  Space,
  Tooltip,
  Typography,
  Upload,
  message,
  notification,
} from 'antd';
import type {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from 'antd/es/upload/interface';

const { Title, Paragraph } = Typography;

interface AvatarUploadProps {
  currentImage?: string;
  userId?: string;
  onSuccess?: (imageUrl: string) => void;
  maxSize?: number; // در کیلوبایت
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentImage,
  userId,
  onSuccess,
  maxSize = 2048, // 2MB پیش‌فرض
}) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(currentImage);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined,
  );
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // تبدیل فایل به Base64 برای نمایش پیش‌نمایش
  const getBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // بررسی نوع و سایز فایل قبل از آپلود
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('فقط می‌توانید فایل‌های JPG/PNG آپلود کنید!');
      return Upload.LIST_IGNORE;
    }

    const isLessThanMaxSize = file.size / 1024 < maxSize;
    if (!isLessThanMaxSize) {
      message.error(`تصویر باید کمتر از ${maxSize / 1024} مگابایت باشد!`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  // مدیریت تغییرات آپلود
  const handleChange: UploadProps['onChange'] = async (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      // در حالت واقعی، اینجا آدرس تصویر از پاسخ سرور دریافت می‌شود
      // اما در اینجا ما از Base64 تصویر برای نمایش استفاده می‌کنیم
      try {
        const url = await getBase64(info.file.originFileObj as RcFile);
        setImageUrl(url);
        setLoading(false);

        if (onSuccess) {
          onSuccess(url);
        }

        notification.success({
          message: 'تصویر پروفایل آپلود شد',
          description: 'تصویر پروفایل شما با موفقیت به‌روزرسانی شد.',
        });
      } catch (error) {
        setLoading(false);
        message.error('خطا در آپلود تصویر');
      }
    }

    if (info.file.status === 'error') {
      setLoading(false);
      message.error('خطا در آپلود تصویر');
    }

    setFileList(info.fileList.slice(-1)); // فقط آخرین فایل را نگه می‌داریم
  };

  // شبیه‌سازی آپلود به سرور
  const customRequest = ({ file, onSuccess, onError }: any) => {
    // شبیه‌سازی تأخیر آپلود
    setTimeout(() => {
      // شبیه‌سازی موفقیت آپلود
      if (Math.random() > 0.1) {
        // 90% موفقیت
        onSuccess('ok', new XMLHttpRequest());
      } else {
        // 10% خطا
        onError(new Error('خطا در آپلود فایل'));
      }
    }, 1500);
  };

  // نمایش پیش‌نمایش تصویر
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  // آیکون آپلود
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>آپلود</div>
    </div>
  );

  // حذف تصویر پروفایل
  const handleRemoveAvatar = () => {
    Modal.confirm({
      title: 'حذف تصویر پروفایل',
      content: 'آیا از حذف تصویر پروفایل خود اطمینان دارید؟',
      okText: 'بله، حذف شود',
      cancelText: 'انصراف',
      okButtonProps: { danger: true },
      onOk: () => {
        setLoading(true);

        // شبیه‌سازی حذف تصویر
        setTimeout(() => {
          setImageUrl(undefined);
          setFileList([]);
          setLoading(false);

          if (onSuccess) {
            onSuccess('');
          }

          notification.success({
            message: 'تصویر پروفایل حذف شد',
            description: 'تصویر پروفایل شما با موفقیت حذف شد.',
          });
        }, 1000);
      },
    });
  };

  return (
    <Card className="avatar-upload">
      <div className="mb-6">
        <Title level={4}>تصویر پروفایل</Title>
        <Paragraph type="secondary">
          تصویر پروفایل خود را آپلود یا ویرایش کنید. حداکثر سایز مجاز:{' '}
          {maxSize / 1024} مگابایت.
        </Paragraph>
      </div>

      <div className="flex flex-col items-center justify-center md:flex-row md:justify-start">
        <div className="mb-4 mr-0 md:mb-0 md:ml-6">
          <Avatar
            size={100}
            src={imageUrl}
            icon={!imageUrl && <UserOutlined />}
            className="border-2 border-white shadow-md"
          />
        </div>

        <div>
          <Space direction="vertical" size="middle">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              customRequest={customRequest}
              fileList={fileList}
              onPreview={handlePreview}
            >
              {uploadButton}
            </Upload>

            <Space>
              {imageUrl && (
                <Tooltip title="حذف تصویر پروفایل">
                  <Button
                    danger
                    onClick={handleRemoveAvatar}
                    disabled={loading}
                  >
                    حذف تصویر
                  </Button>
                </Tooltip>
              )}

              {imageUrl && (
                <Tooltip title="نمایش تصویر">
                  <Button
                    icon={<CameraOutlined />}
                    onClick={() => {
                      setPreviewImage(imageUrl);
                      setPreviewVisible(true);
                    }}
                  >
                    نمایش تصویر
                  </Button>
                </Tooltip>
              )}
            </Space>

            <Paragraph className="text-xs text-gray-500">
              فرمت‌های پشتیبانی شده: JPG، PNG
            </Paragraph>
          </Space>
        </div>
      </div>

      <Modal
        open={previewVisible}
        title="پیش‌نمایش تصویر"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img
          alt="پیش‌نمایش تصویر"
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>
    </Card>
  );
};

export default AvatarUpload;
