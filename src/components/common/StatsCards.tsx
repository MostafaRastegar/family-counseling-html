'use client';

import { ReactNode } from 'react';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  Card,
  Col,
  Progress,
  Row,
  Space,
  Statistic,
  Tooltip,
  Typography,
} from 'antd';

const { Title, Text } = Typography;

export type StatItem = {
  /**
   * Title or label for the stat
   */
  title: string;
  /**
   * The main value to display
   */
  value: string | number;
  /**
   * Icon to display with the stat
   */
  icon?: ReactNode;
  /**
   * Accent color for the stat
   */
  color?: string;
  /**
   * Prefix before the value
   */
  prefix?: ReactNode | string;
  /**
   * Suffix after the value
   */
  suffix?: ReactNode | string;
  /**
   * Percentage change indicator
   */
  change?: number;
  /**
   * Additional description text
   */
  description?: string;
  /**
   * Precision for the value (number of decimal places)
   */
  precision?: number;
  /**
   * Format function for the value
   */
  formatter?: (value: number | string) => ReactNode;
  /**
   * Optional secondary value
   */
  secondaryValue?: string | number;
  /**
   * Optional secondary label
   */
  secondaryLabel?: string;
  /**
   * Progress percentage (0-100)
   */
  progress?: number;
  /**
   * Link to navigate to when clicked
   */
  link?: string;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Custom render function for the content
   */
  render?: (stat: StatItem) => ReactNode;
};

export type StatsCardsProps = {
  /**
   * Array of stat items to display
   */
  stats: StatItem[];
  /**
   * Optional title for the entire stats group
   */
  title?: string | ReactNode;
  /**
   * Optional description for the entire stats group
   */
  description?: string | ReactNode;
  /**
   * Number of cards per row on different screen sizes
   */
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /**
   * Loading state for all cards
   */
  loading?: boolean;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Card size
   */
  size?: 'default' | 'small';
  /**
   * Whether to use a card wrapper for the entire component
   */
  withCard?: boolean;
  /**
   * Optional custom header
   */
  header?: ReactNode;
  /**
   * Optional custom footer
   */
  footer?: ReactNode;
  /**
   * Spacing between cards
   */
  gutter?: number | [number, number];
  /**
   * Layout type: 'grid' or 'inline'
   */
  layout?: 'grid' | 'inline';
  /**
   * Card border: true for bordered cards, false for borderless
   */
  bordered?: boolean;
};

/**
 * A flexible component for displaying statistics and metrics in cards
 */
const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  title,
  description,
  cols = {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6,
  },
  loading = false,
  className = '',
  size = 'default',
  withCard = true,
  header,
  footer,
  gutter = [16, 16],
  layout = 'grid',
  bordered = true,
}) => {
  // Calculate column spans for different screen sizes
  const getColSpans = () => {
    return {
      xs: cols.xs || 24,
      sm: cols.sm || 12,
      md: cols.md || 8,
      lg: cols.lg || 6,
      xl: cols.xl || 6,
    };
  };

  // Render a single stat card
  const renderStatCard = (stat: StatItem, index: number) => {
    // Handle change indicator (up/down arrow and color)
    const renderChange = () => {
      if (stat.change === undefined) return null;

      const isPositive = stat.change > 0;
      const changeIcon = isPositive ? (
        <ArrowUpOutlined />
      ) : (
        <ArrowDownOutlined />
      );
      const changeColor = isPositive ? '#52c41a' : '#f5222d';

      return (
        <Text style={{ color: changeColor }} className="ml-2">
          {changeIcon} {Math.abs(stat.change)}%
        </Text>
      );
    };

    // Main card content
    const cardContent = (
      <>
        {/* If a custom render function is provided, use it */}
        {stat.render ? (
          stat.render(stat)
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between">
              <Text className="text-gray-600">{stat.title}</Text>
              {stat.description && (
                <Tooltip title={stat.description}>
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              )}
            </div>

            <div className="mb-2 flex items-baseline">
              <Statistic
                value={stat.value}
                precision={stat.precision || 0}
                valueStyle={{
                  color: stat.color || 'inherit',
                  fontSize: size === 'small' ? '1.5rem' : '2rem',
                  fontWeight: 'bold',
                }}
                prefix={stat.prefix}
                suffix={stat.suffix}
                formatter={stat.formatter}
                loading={loading || stat.loading}
              />
              {renderChange()}
            </div>

            {stat.secondaryValue !== undefined && (
              <div className="flex items-center text-sm text-gray-500">
                <span>{stat.secondaryLabel || 'Total'}:</span>
                <Text strong className="ml-1">
                  {stat.secondaryValue}
                </Text>
              </div>
            )}

            {stat.progress !== undefined && (
              <Progress
                percent={stat.progress}
                size="small"
                status="active"
                strokeColor={stat.color}
                className="mt-2"
              />
            )}

            {stat.icon && (
              <div
                className="absolute right-4 top-4 rounded-full p-2"
                style={{
                  background: `${stat.color}20`,
                  color: stat.color || 'inherit',
                }}
              >
                {stat.icon}
              </div>
            )}
          </>
        )}
      </>
    );

    // Card component with hover effects if clickable
    return (
      <Col key={index} {...getColSpans()}>
        <Card
          bordered={bordered}
          className={`h-full ${stat.onClick || stat.link ? 'cursor-pointer hover:shadow-md' : ''}`}
          onClick={stat.onClick}
          size={size}
          loading={loading || stat.loading}
          style={{
            borderTop: stat.color ? `3px solid ${stat.color}` : undefined,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {cardContent}
        </Card>
      </Col>
    );
  };

  // For inline layout, we don't use the grid system
  const renderInlineStats = () => {
    return (
      <div className="flex flex-wrap">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="mb-4 mr-4 inline-block"
            style={{ minWidth: '200px' }}
          >
            <Card
              bordered={bordered}
              className={`h-full ${stat.onClick || stat.link ? 'cursor-pointer hover:shadow-md' : ''}`}
              onClick={stat.onClick}
              size="small"
              loading={loading || stat.loading}
              style={{
                borderLeft: stat.color ? `3px solid ${stat.color}` : undefined,
                position: 'relative',
              }}
            >
              <Space align="center">
                {stat.icon && (
                  <div
                    className="rounded-full p-2"
                    style={{
                      background: `${stat.color}20`,
                      color: stat.color || 'inherit',
                    }}
                  >
                    {stat.icon}
                  </div>
                )}
                <div>
                  <div className="text-xs text-gray-500">{stat.title}</div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.prefix}
                    {stat.value}
                    {stat.suffix}
                  </div>
                </div>
              </Space>
            </Card>
          </div>
        ))}
      </div>
    );
  };

  // Main component content
  const content = (
    <>
      {(title || header) && (
        <div className="mb-4">
          {header || (
            <>
              {typeof title === 'string' ? (
                <Title level={4}>{title}</Title>
              ) : (
                title
              )}
              {description && (
                <div className="text-gray-500">{description}</div>
              )}
            </>
          )}
        </div>
      )}

      {layout === 'grid' ? (
        <Row gutter={gutter}>
          {stats.map((stat, index) => renderStatCard(stat, index))}
        </Row>
      ) : (
        renderInlineStats()
      )}

      {footer && <div className="mt-4">{footer}</div>}
    </>
  );

  // Wrap in card if requested
  return withCard ? (
    <Card className={className}>{content}</Card>
  ) : (
    <div className={className}>{content}</div>
  );
};

export default StatsCards;
