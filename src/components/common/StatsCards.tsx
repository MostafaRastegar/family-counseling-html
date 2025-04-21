'use client';

import React, { ReactNode } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Statistic, Typography } from 'antd';
import { StatisticProps } from 'antd/es/statistic/Statistic';

const { Text, Title } = Typography;

export interface StatCardItem {
  key: string;
  title: string;
  value: number | string;
  icon?: ReactNode;
  iconBackground?: string;
  color?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  precision?: number;
  loading?: boolean;
  trend?: {
    value: number;
    type: 'increase' | 'decrease';
    text?: string;
  };
  description?: string | ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
}

export interface StatsCardsProps {
  stats: StatCardItem[];
  gutter?: number | [number, number];
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  cardSpan?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
  };
  className?: string;
  loading?: boolean;
  cardClassName?: string;
  cardBodyStyle?: React.CSSProperties;
  groupCard?: boolean;
  hoverable?: boolean;
}

/**
 * StatsCards - A reusable component for displaying statistics in cards
 *
 * This component provides a flexible grid of statistic cards that can be used
 * in dashboards and overview pages.
 */
const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  gutter = [16, 16],
  title,
  subtitle,
  cardSpan = {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6,
    xxl: 6,
  },
  className = '',
  loading = false,
  cardClassName = '',
  cardBodyStyle,
  groupCard = false,
  hoverable = false,
}) => {
  // Render a single stat card
  const renderStatCard = (stat: StatCardItem, index: number) => {
    const valueStyle: React.CSSProperties = {
      color: stat.color,
    };

    // Statistic props
    const statisticProps: StatisticProps = {
      title: stat.title,
      value: stat.value,
      precision: stat.precision,
      prefix: stat.prefix,
      suffix: stat.suffix,
      loading: loading || stat.loading,
      valueStyle,
    };

    // Trend indicator if provided
    const trendIndicator = stat.trend ? (
      <div className="mt-1 flex items-center">
        {stat.trend.type === 'increase' ? (
          <ArrowUpOutlined style={{ color: '#52c41a' }} />
        ) : (
          <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
        )}
        <Text
          className="mx-1"
          style={{
            color: stat.trend.type === 'increase' ? '#52c41a' : '#ff4d4f',
          }}
        >
          {stat.trend.value}%
        </Text>
        {stat.trend.text && <Text type="secondary">{stat.trend.text}</Text>}
      </div>
    ) : null;

    // Individual card
    const cardContent = (
      <div className="stat-card-content">
        <div className="flex items-start justify-between">
          {stat.icon && (
            <div
              className="stat-card-icon flex size-10 items-center justify-center rounded-full"
              style={{ backgroundColor: stat.iconBackground || '#f0f5ff' }}
            >
              {stat.icon}
            </div>
          )}
          <Statistic {...statisticProps} />
        </div>

        {(stat.description || trendIndicator) && (
          <div className="stat-card-description mt-2">
            {typeof stat.description === 'string' ? (
              <Text type="secondary">{stat.description}</Text>
            ) : (
              stat.description
            )}
            {trendIndicator}
          </div>
        )}

        {stat.footer && (
          <div className="stat-card-footer mt-2 border-t border-gray-200 pt-2">
            {stat.footer}
          </div>
        )}
      </div>
    );

    // If using individual cards for each stat
    if (!groupCard) {
      return (
        <Col
          key={stat.key || index}
          xs={cardSpan.xs}
          sm={cardSpan.sm}
          md={cardSpan.md}
          lg={cardSpan.lg}
          xl={cardSpan.xl}
          xxl={cardSpan.xxl}
        >
          <Card
            className={`stat-card ${cardClassName}`}
            bodyStyle={cardBodyStyle}
            hoverable={hoverable || !!stat.onClick}
            onClick={stat.onClick}
          >
            {cardContent}
          </Card>
        </Col>
      );
    }

    // If using a grouped card approach
    return (
      <Col
        key={stat.key || index}
        xs={cardSpan.xs}
        sm={cardSpan.sm}
        md={cardSpan.md}
        lg={cardSpan.lg}
        xl={cardSpan.xl}
        xxl={cardSpan.xxl}
      >
        <div className={`stat-item ${cardClassName} h-full p-4`}>
          {cardContent}
        </div>
      </Col>
    );
  };

  // If using a grouped card approach
  if (groupCard) {
    return (
      <div className={`stats-cards ${className}`}>
        {(title || subtitle) && (
          <div className="stats-cards-header mb-4">
            {title &&
              (typeof title === 'string' ? (
                <Title level={5}>{title}</Title>
              ) : (
                title
              ))}
            {subtitle &&
              (typeof subtitle === 'string' ? (
                <Text type="secondary">{subtitle}</Text>
              ) : (
                subtitle
              ))}
          </div>
        )}

        <Card bodyStyle={{ padding: 0 }}>
          <Row gutter={gutter} className="p-4">
            {stats.map(renderStatCard)}
          </Row>
        </Card>
      </div>
    );
  }

  // Default individual cards approach
  return (
    <div className={`stats-cards ${className}`}>
      {(title || subtitle) && (
        <div className="stats-cards-header mb-4">
          {title &&
            (typeof title === 'string' ? (
              <Title level={5}>{title}</Title>
            ) : (
              title
            ))}
          {subtitle &&
            (typeof subtitle === 'string' ? (
              <Text type="secondary">{subtitle}</Text>
            ) : (
              subtitle
            ))}
        </div>
      )}

      <Row gutter={gutter}>{stats.map(renderStatCard)}</Row>
    </div>
  );
};

export default StatsCards;
