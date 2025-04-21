'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Button, Typography, Tooltip } from 'antd';
import { DownOutlined, UpOutlined, EllipsisOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

export interface ExpandableTextProps {
  children: string | ReactNode;
  maxLines?: number;
  expandText?: string;
  collapseText?: string;
  expanded?: boolean;
  truncateThreshold?: number;
  lineHeight?: number;
  className?: string;
  textClassName?: string;
  buttonClassName?: string;
  showButton?: boolean | 'auto';
  ellipsis?: boolean | string;
  collapsible?: boolean;
  tooltip?: string;
  buttonType?: 'text' | 'link' | 'default' | 'primary' | 'dashed';
  buttonSize?: 'small' | 'middle' | 'large';
  buttonIcon?: boolean | {
    expand?: ReactNode;
    collapse?: ReactNode;
  };
  onExpand?: (expanded: boolean) => void;
  noAnimation?: boolean;
  style?: React.CSSProperties;
  textColor?: string;
  buttonColor?: string;
  align?: 'left' | 'center' | 'right';
  useTooltipForMore?: boolean;
  removeHtmlTags?: boolean;
}

/**
 * ExpandableText - A component for displaying text with expand/collapse functionality
 * 
 * This component shows a limited number of lines of text with an option to expand
 * to show the full content, and vice versa.
 */
const ExpandableText: React.FC<ExpandableTextProps> = ({
  children,
  maxLines = 3,
  expandText = 'نمایش بیشتر',
  collapseText = 'نمایش کمتر',
  expanded = false,
  truncateThreshold = 10,
  lineHeight = 1.5,
  className = '',
  textClassName = '',
  buttonClassName = '',
  showButton = 'auto',
  ellipsis = '...',
  collapsible = true,
  tooltip,
  buttonType = 'link',
  buttonSize = 'small',
  buttonIcon = true,
  onExpand,
  noAnimation = false,
  style,
  textColor,
  buttonColor,
  align = 'right',
  useTooltipForMore = false,
  removeHtmlTags = false,
}) => {
  // State for tracking if content is expanded
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  // State to track if content needs truncation
  const [needsTruncation, setNeedsTruncation] = useState(false);
  
  // Refs to the content elements
  const fullTextRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handler for expanding/collapsing the text
  const toggleExpanded = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onExpand) {
      onExpand(newExpandedState);
    }
  };
  
  // Calculate text height and determine if truncation is needed
  useEffect(() => {
    const checkOverflow = () => {
      const container = containerRef.current;
      const fullText = fullTextRef.current;
      
      if (!container || !fullText) {
        return;
      }
      
      // Get actual content height and calculate max height based on max lines
      const actualHeight = fullText.scrollHeight;
      const maxHeight = lineHeight * maxLines * parseFloat(getComputedStyle(fullText).fontSize);
      
      // Content needs truncation if it exceeds the maximum height
      const needsTrunc = actualHeight > maxHeight;
      setNeedsTruncation(needsTrunc);
      
      // If showButton is 'auto', we'll use needsTruncation to determine if the button should be shown
      // Otherwise, we use the provided boolean value
    };
    
    // Initial check
    checkOverflow();
    
    // Add window resize listener for responsive behavior
    window.addEventListener('resize', checkOverflow);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, [children, maxLines, lineHeight]);
  
  // Process the text content based on various options
  const processContent = (content: string | ReactNode): ReactNode => {
    if (typeof content !== 'string') {
      // If content is not a string (e.g., JSX), return as is
      return content;
    }
    
    if (removeHtmlTags) {
      // Remove HTML tags if required
      content = content.replace(/<[^>]*>/g, '');
    }
    
    return content;
  };
  
  // Build the button element for expand/collapse
  const buildButton = () => {
    // Determine if the button should be shown based on showButton setting
    const shouldShowButton = showButton === 'auto' 
      ? needsTruncation || (isExpanded && collapsible)
      : showButton;
    
    if (!shouldShowButton) {
      return null;
    }
    
    // Determine button text and icon based on current expanded state
    const buttonText = isExpanded ? collapseText : expandText;
    let buttonIcon;
    
    if (typeof buttonIcon === 'boolean') {
      buttonIcon = isExpanded 
        ? <UpOutlined /> 
        : <DownOutlined />;
    } else if (buttonIcon) {
      buttonIcon = isExpanded 
        ? buttonIcon.collapse || <UpOutlined /> 
        : buttonIcon.expand || <DownOutlined />;
    }
    
    // Use tooltip if specified
    const buttonElement = (
      <Button
        type={buttonType}
        size={buttonSize}
        onClick={toggleExpanded}
        className={`expandable-text-button ${buttonClassName}`}
        icon={buttonIcon}
        style={{ color: buttonColor }}
      >
        {buttonText}
      </Button>
    );
    
    return tooltip ? (
      <Tooltip title={tooltip}>
        {buttonElement}
      </Tooltip>
    ) : buttonElement;
  };
  
  // Determine if the ellipsis should be shown
  const showEllipsis = !isExpanded && needsTruncation && ellipsis;
  
  // Build text content style
  const textStyle: React.CSSProperties = {
    color: textColor,
    ...(!isExpanded && needsTruncation ? {
      display: '-webkit-box',
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    } : {}),
    ...(noAnimation ? {} : {
      transition: 'max-height 0.3s ease',
    }),
  };
  
  // Get content to display
  const content = processContent(children);
  
  // Define alignment class for button container
  const alignClass = `text-${align}`;
  
  return (
    <div className={`expandable-text ${className}`} style={style} ref={containerRef}>
      <div 
        className={`expandable-text-content ${textClassName}`} 
        style={textStyle}
        ref={fullTextRef}
      >
        {content}
        {showEllipsis && (
          <span className="expandable-text-ellipsis">
            {typeof ellipsis === 'string' ? ellipsis : <EllipsisOutlined />}
            {useTooltipForMore && (
              <Tooltip title={expandText}>
                <span className="cursor-pointer ml-1" onClick={toggleExpanded}>
                  <DownOutlined />
                </span>
              </Tooltip>
            )}
          </span>
        )}
      </div>
      
      {!useTooltipForMore && (
        <div className={`expandable-text-button-container mt-1 ${alignClass}`}>
          {buildButton()}
        </div>
      )}
    </div>
  );
};

export default ExpandableText;