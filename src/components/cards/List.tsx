import React from 'react';
import { Card, Col, Row, Tag } from 'antd';
import { CheckOutlined, LoginOutlined, RightOutlined, UsbOutlined } from '@ant-design/icons';
import { merge } from 'lodash';
import clsx from 'clsx';

import LinkIf from '../Link';
import PageError from '../PageError';

type ItemType = {
  key: string;
  name: React.ReactNode;

  path?: string;
  description?: React.ReactNode;
  status?: React.ReactNode;
  icon?: any;
  configured?: boolean;
  extra?: React.ReactNode;
  onClick?: (e?: any) => void;
}

type PropTypes = {
  cardProps?: Record<string, any>;
  title?: React.ReactNode;
  description?: React.ReactNode;
  // items?: any[];
  isError?: boolean;
  errorProps?: any;
  items?: ItemType[];
  children?: React.ReactNode;
}

export default function CardList(props: PropTypes) {
  const renderConfigured = (configured: boolean) => {
    console.log('renderConfigured', configured)
    if (typeof configured !== 'boolean')
      return null

    return configured
      ? <Tag className="tag-set ant-tag-has-color">Set</Tag>
      : <Tag className="tag-unset ant-tag-has-color">Unset</Tag>
  }

  return (
    <Card
      className="card-shadow"
      size="small"
      // style={{ marginTop: '24px' }}
      // styles={{ body: { padding: 0 } }}
      {...merge(
        {style: { marginTop: '24px' }},
        {styles: { body: { padding: 0 } }},
        props.cardProps,
      )}
    >
      {(props.title || props.description) && (
        <div className="card-list-header">
          <div className="card-list-header-title">
            {props.title}
          </div>
          <div className="card-list-header-desc">
            {props.description}
          </div>
        </div>
      )}
      {props.isError ? <PageError {...props.errorProps} /> : (props.items || []).map(item => (
        <LinkIf key={item.key} to={item.path}>
          <div
            className={clsx("menu-list-item", { "selectable": !!(item.path || item.onClick) })}
            onClick={item.onClick}
          >
            <Row wrap={false} align="middle" style={{ columnGap: '12px' }}>
              <Col flex="none" className="ant-row ant-row-middle menu-list-item-icon">
                {item.icon}
              </Col>
              <Col flex="auto" className="menu-list-item-content">
                <Row align="middle" gutter={[12, 12]}>
                  <Col flex="1 1 166px">
                    <div>
                      <span className="content-name">
                        {item.name}
                        {renderConfigured(item.configured)}
                      </span>
                    </div>
                    <div>
                      <span className="content-description">
                        {item.description}
                      </span>
                    </div>
                  </Col>
                  <Col flex="1 1 160px" className="text-truncate">
                    <span className="content-status">
                      {item.status}
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col>
                {item.extra || <RightOutlined />}
              </Col>
            </Row>
          </div>
        </LinkIf>
      ))}
      {props.children}
    </Card>
  )
}