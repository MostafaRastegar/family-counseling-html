'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Space, Tag, Typography } from 'antd';

const { Title, Text, Paragraph } = Typography;

export type GenericCardAction = {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick?: (item: any) => void;
  href?: string;
  type?: 'default' | 'primary' | 'link' | 'text' | 'dashed';
  danger?: boolean;
  disabled?: boolean;
};

export type GenericCardProps = {
  /**
   * The item data to display in the card
   */
  item: any;
  /**
   * The title to display in the card
   */
  title?: string | ((item: any) => string);
  /**
   * The subtitle to display in the card
   */
  subtitle?: string | ((item: any) => string);
  /**
   * Primary image or avatar URL
   */
  imageUrl?: string | ((item: any) => string);
  /**
   * Primary content/description for the card
   */
  description?: string | ((item: any) => string);
  /**
   * Secondary or additional content
   */
  secondaryContent?: ReactNode | ((item: any) => ReactNode);
  /**
   * Status component or tag to display
   */
  status?: ReactNode | ((item: any) => ReactNode);
  /**
   * List of tags to display
   */
  tags?: string[] | ((item: any) => string[]);
  /**
   * Label for badge counter or notification
   */
  badge?: string | number | ((item: any) => string | number);
  /**
   * Actions that can be performed on the card
   */
  actions?: GenericCardAction[] | ((item: any) => GenericCardAction[]);
  /**
   * Footer content
   */
  footer?: ReactNode | ((item: any) => ReactNode);
  /**
   * Whether the card should be hoverable
   */
  hoverable?: boolean;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Whether the card should be loading
   */
  loading?: boolean;
  /**
   * Render a custom header
   */
  renderHeader?: (item: any) => ReactNode;
  /**
   * Render custom content
   */
  renderContent?: (item: any) => ReactNode;
  /**
   * Link for the entire card
   */
  linkTo?: string | ((item: any) => string);
  /**
   * Callback when card is clicked
   */
  onClick?: (item: any) => void;
  /**
   * Size of the card
   */
  size?: 'small' | 'default' | 'large';
  /**
   * Type of layout
   */
  layout?: 'horizontal' | 'vertical';
};

/**
 * Generic Card component that can be configured to display various card layouts
 */
const GenericCard: React.FC<GenericCardProps> = ({
  item,
  title,
  subtitle,
  imageUrl,
  description,
  secondaryContent,
  status,
  tags,
  badge,
  actions,
  footer,
  hoverable = true,
  className = '',
  loading = false,
  renderHeader,
  renderContent,
  linkTo,
  onClick,
  size = 'default',
  layout = 'vertical',
}) => {
  // Extract dynamic values from props
  const getTitle = typeof title === 'function' ? title(item) : title || '';
  const getSubtitle =
    typeof subtitle === 'function' ? subtitle(item) : subtitle || '';
  const getImageUrl =
    typeof imageUrl === 'function' ? imageUrl(item) : imageUrl || '';
  const getDescription =
    typeof description === 'function' ? description(item) : description || '';
  const getStatus = typeof status === 'function' ? status(item) : status;
  const getTags = typeof tags === 'function' ? tags(item) : tags || [];
  const getBadge = typeof badge === 'function' ? badge(item) : badge;
  const getActions =
    typeof actions === 'function' ? actions(item) : actions || [];
  const getFooter = typeof footer === 'function' ? footer(item) : footer;
  const getLinkTo = typeof linkTo === 'function' ? linkTo(item) : linkTo;

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  // Wrap the card in a link if linkTo is provided
  const CardWrapper = ({ children }: { children: ReactNode }) => {
    if (getLinkTo) {
      return <Link href={getLinkTo}>{children}</Link>;
    }
    return <>{children}</>;
  };

  // Render the actions
  const renderActions = () => {
    if (!getActions || getActions.length === 0) return null;

    return (
      <div className="mt-4 flex flex-wrap gap-2">
        {getActions.map((action) => {
          const ActionComponent = () => (
            <Button
              key={action.key}
              icon={action.icon}
              type={action.type || 'default'}
              danger={action.danger}
              disabled={action.disabled}
              onClick={
                action.onClick ? () => action.onClick?.(item) : undefined
              }
              size="small"
            >
              {action.label}
            </Button>
          );

          if (action.href) {
            return (
              <Link key={action.key} href={action.href}>
                <ActionComponent />
              </Link>
            );
          }

          return <ActionComponent key={action.key} />;
        })}
      </div>
    );
  };

  return (
    <Card
      hoverable={hoverable}
      loading={loading}
      className={`generic-card ${className} ${layout === 'horizontal' ? 'flex' : ''}`}
      onClick={handleCardClick}
      size={size}
    >
      {/* Custom header if provided */}
      {renderHeader ? (
        renderHeader(item)
      ) : (
        <>
          {layout === 'horizontal' ? (
            <div className="flex items-start">
              {getImageUrl && (
                <div className="mr-4">
                  <Avatar
                    size={64}
                    src={getImageUrl}
                    icon={!getImageUrl && <UserOutlined />}
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    {getTitle && (
                      <Title level={5} className="mb-0">
                        {getTitle}
                      </Title>
                    )}
                    {getSubtitle && <Text type="secondary">{getSubtitle}</Text>}
                  </div>
                  {getStatus && <div>{getStatus}</div>}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center">
                  {getImageUrl && (
                    <Avatar
                      size={layout === 'vertical' ? 48 : 32}
                      src={getImageUrl}
                      icon={!getImageUrl && <UserOutlined />}
                      className="mr-3"
                    />
                  )}
                  <div>
                    {getTitle && (
                      <Title level={5} className="mb-0">
                        {getTitle}
                      </Title>
                    )}
                    {getSubtitle && <Text type="secondary">{getSubtitle}</Text>}
                  </div>
                </div>
                {getStatus && <div>{getStatus}</div>}
              </div>
            </>
          )}
        </>
      )}

      {/* Custom content if provided, otherwise render default */}
      {renderContent ? (
        renderContent(item)
      ) : (
        <>
          {/* Tags */}
          {getTags && getTags.length > 0 && (
            <div className="mb-3">
              {getTags.map((tag, index) => (
                <Tag key={index} className="mb-1 mr-1">
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          {/* Description */}
          {getDescription && (
            <Paragraph
              className="mb-4"
              ellipsis={layout === 'vertical' ? { rows: 3 } : false}
            >
              {getDescription}
            </Paragraph>
          )}

          {/* Secondary Content */}
          {secondaryContent && (
            <div className="mb-3">
              {typeof secondaryContent === 'function'
                ? secondaryContent(item)
                : secondaryContent}
            </div>
          )}
        </>
      )}

      {/* Actions */}
      {renderActions()}

      {/* Footer */}
      {getFooter && <div className="mt-3">{getFooter}</div>}
    </Card>
  );
};

export default GenericCard;
