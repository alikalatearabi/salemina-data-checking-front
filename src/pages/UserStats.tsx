import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Table, Tabs, Typography, Spin, Alert, Tag, Badge, Tooltip, Empty, ConfigProvider, AutoComplete } from 'antd';
import { SearchOutlined, BarChartOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { fetchUserProductStats, UserProductStats, StatusGroup, DailyCount, fetchImporters } from '../api/userStats';
import moment from 'moment-jalaali';
import { ColumnsType } from 'antd/es/table';
import styles from './UserStats.module.scss';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const UserStats: React.FC = () => {
  const [username, setUsername] = useState('');
  const [userStats, setUserStats] = useState<UserProductStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importers, setImporters] = useState<string[]>([]);
  const [options, setOptions] = useState<{ value: string }[]>([]);

  // Fetch importers list on component mount
  useEffect(() => {
    const getImporters = async () => {
      setLoadingUsers(true);
      try {
        const importersList = await fetchImporters();
        setImporters(importersList);
        setOptions(importersList.map(name => ({ value: name })));
      } catch (err) {
        console.error('Error fetching importers:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    getImporters();
  }, []);

  // Filter options based on search text
  const onSearch = (searchText: string) => {
    const filtered = importers
      .filter(name => name.toLowerCase().includes(searchText.toLowerCase()))
      .map(name => ({ value: name }));
    setOptions(filtered);
  };

  // Handle username selection
  const onSelect = (value: string) => {
    setUsername(value);
  };

  const fetchStats = async () => {
    if (!username.trim()) {
      setError('لطفا نام کاربری را وارد کنید');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchUserProductStats(username);
      setUserStats(data);
    } catch (err) {
      setError('خطا در دریافت اطلاعات. لطفا دوباره تلاش کنید.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format status for display
  const formatStatus = (status: StatusGroup) => {
    return (
      <div className={styles.statusCell}>
        <Tag 
          color={getStatusColor(status.main_data_status)} 
          style={{ minWidth: '80px', textAlign: 'center' }}
        >
          {status.main_data_status}
        </Tag>
        <Text>/</Text>
        <Tag 
          color={getStatusColor(parseInt(status.extra_data_status) || 0)} 
          style={{ minWidth: '80px', textAlign: 'center' }}
        >
          {status.extra_data_status !== "undefined" ? status.extra_data_status : "-"}
        </Tag>
      </div>
    );
  };

  // Helper function to get color based on status
  const getStatusColor = (status: number) => {
    switch (status) {
      case 2: return 'green';
      case 3: return 'orange';
      case 7: return 'blue';
      case 11: return 'magenta';
      default: return 'default';
    }
  };

  // Convert Gregorian dates to Jalali (Persian) format
  const formatDate = (dateString: string) => {
    return moment(dateString).format('jYYYY/jMM/jDD');
  };

  // Columns for status groups table
  const statusColumns: ColumnsType<StatusGroup> = [
    {
      title: 'وضعیت (اضافی/اصلی)',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, record: StatusGroup) => formatStatus(record),
      width: 220,
    },
    {
      title: 'تعداد کل',
      dataIndex: 'totalCount',
      key: 'totalCount',
      render: (count: number) => (
        <Badge 
          count={count} 
          style={{ 
            backgroundColor: '#457b9d',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '0 8px'
          }} 
          showZero 
        />
      ),
      width: 120,
      sorter: (a: StatusGroup, b: StatusGroup) => a.totalCount - b.totalCount,
    },
    {
      title: 'تاریخ‌های به‌روزرسانی',
      dataIndex: 'dailyCounts',
      key: 'dailyCounts',
      render: (dailyCounts: DailyCount[]) => {
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {dailyCounts.slice(0, 5).map((count, index) => (
              <Tooltip 
                key={index} 
                title={`${formatDate(count.date)}: ${count.count} مورد`}
              >
                <Tag 
                  color="blue" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    cursor: 'pointer' 
                  }}
                >
                  <CalendarOutlined />
                  <span>{formatDate(count.date).substring(5)}</span>
                  <Badge 
                    count={count.count} 
                    style={{ backgroundColor: '#1d3557' }} 
                  />
                </Tag>
              </Tooltip>
            ))}
            {dailyCounts.length > 5 && (
              <Tooltip 
                title={`${dailyCounts.length - 5} تاریخ دیگر`}
              >
                <Tag color="default">+{dailyCounts.length - 5}</Tag>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  // Columns for daily counts table
  const dailyColumns: ColumnsType<DailyCount> = [
    {
      title: 'تاریخ',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarOutlined />
          {formatDate(date)}
        </span>
      ),
      sorter: (a: DailyCount, b: DailyCount) => 
        new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'تعداد',
      dataIndex: 'count',
      key: 'count',
      render: (count: number, record: DailyCount) => {
        // Calculate intensity for heatmap effect (0-100%)
        // Assuming max count could be around 100, adjust as needed
        const maxCount = 50; // Adjust based on expected max value
        const intensity = Math.min((count / maxCount) * 100, 100);
        const color = `rgba(69, 123, 157, ${intensity/100})`;
        
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Badge 
              count={count} 
              style={{ 
                backgroundColor: '#457b9d',
                fontSize: '14px',
                fontWeight: 'bold',
                padding: '0 8px'
              }} 
              showZero 
            />
            <div style={{ 
              width: `${Math.max(50, intensity * 2)}px`, 
              height: '16px', 
              backgroundColor: color,
              borderRadius: '4px',
            }} />
          </div>
        );
      },
      sorter: (a: DailyCount, b: DailyCount) => a.count - b.count,
    },
  ];

  return (
    <ConfigProvider direction="rtl">
      <div className={styles.statsContainer}>
        <Title level={2} style={{ textAlign: 'center', color: '#1d3557' }}>
          آمار محصولات کاربران
        </Title>
        
        <div className={styles.searchContainer}>
          <AutoComplete
            value={username}
            options={options}
            onSelect={onSelect}
            onSearch={onSearch}
            onChange={setUsername}
            style={{ flex: 1, minWidth: '200px' }}
            notFoundContent={loadingUsers ? <Spin size="small" /> : "کاربری یافت نشد"}
            placeholder="نام کاربری را وارد یا انتخاب کنید"
          >
            <Input 
              suffix={loadingUsers ? <Spin size="small" /> : null}
              prefix={<UserOutlined style={{ color: '#a0aec0' }} />}
              style={{ height: '42px', borderRadius: '8px' }}
              onPressEnter={fetchStats}
            />
          </AutoComplete>
          <Button 
            type="primary" 
            onClick={fetchStats} 
            style={{ 
              height: '42px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #457b9d, #1d3557)',
              boxShadow: '0 4px 12px rgba(69, 123, 157, 0.2)',
            }}
            loading={loading}
          >
            {!loading && <BarChartOutlined />} 
            دریافت آمار
          </Button>
        </div>
        
        {error && <Alert message={error} type="error" showIcon />}
        
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Spin size="large" tip="در حال دریافت اطلاعات..." />
          </div>
        )}
        
        {userStats && !loading && (
          <>
            <div className={styles.statsHeader}>
              <Title level={3} style={{ margin: 0 }}>
                آمار کاربر: <Text strong>{userStats.username}</Text>
              </Title>
              <Tag color="#457b9d" style={{ fontSize: '16px', padding: '4px 12px' }}>
                <FileTextOutlined /> تعداد کل محصولات: {userStats.totalProducts}
              </Tag>
            </div>
            
            <div className={styles.statsLayout}>
              <div className={styles.statCards}>
                {userStats.statusGroups.map((group, index) => (
                  <Card 
                    key={index}
                    className={styles.styledCard}
                    title={
                      <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {formatStatus(group)}
                      </div>
                    }
                    bordered={false}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <Text strong>تعداد کل:</Text>
                        <div style={{ 
                          fontSize: '24px', 
                          fontWeight: 'bold', 
                          color: '#1d3557', 
                          marginTop: '4px' 
                        }}>
                          {group.totalCount}
                        </div>
                      </div>
                      <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '50%', 
                        background: `conic-gradient(from 90deg, #457b9d ${group.totalCount/userStats.totalProducts*100}%, #f0f0f0 0)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <div style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '50%', 
                          background: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          color: '#457b9d'
                        }}>
                          {Math.round(group.totalCount/userStats.totalProducts*100)}%
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      flex: 1,
                      display: 'flex', 
                      flexDirection: 'column',
                      overflowY: 'auto'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <Text strong>آمار روزانه:</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {group.dailyCounts.length} روز
                        </Text>
                      </div>
                      
                      <div className={styles.dailyCounts}>
                        {group.dailyCounts
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((count, idx) => {
                            // Find max count to calculate relative size
                            const maxCount = Math.max(...group.dailyCounts.map(c => c.count));
                            // Calculate intensity for background color
                            const intensity = Math.min((count.count / maxCount) * 100, 100);
                            const bgColor = `rgba(69, 123, 157, ${0.1 + intensity/100 * 0.4})`;
                            
                            return (
                              <Tooltip 
                                key={idx} 
                                className={styles.rtlTooltip}
                                title={`${count.count} محصول در تاریخ ${formatDate(count.date)}`} 
                                placement="top"
                              >
                                <Tag
                                  className={styles.dailyCountTag}
                                  color="blue" 
                                  style={{ 
                                    backgroundColor: bgColor,
                                    border: '1px solid rgba(69, 123, 157, 0.3)',
                                    fontSize: `${12 + (intensity / 100) * 2}px`,
                                  }}
                                >
                                  <CalendarOutlined />
                                  {formatDate(count.date)}
                                  <Badge 
                                    count={count.count} 
                                    style={{
                                      backgroundColor: '#1d3557',
                                      fontSize: '11px',
                                    }}
                                  />
                                </Tag>
                              </Tooltip>
                            );
                          })
                        }
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className={styles.tabContainer}>
                <Tabs defaultActiveKey="1">
                  <TabPane 
                    tab={<span><CheckCircleOutlined />گروه‌های وضعیت</span>} 
                    key="1"
                  >
                    <Table 
                      className={styles.statusGroupTable}
                      dataSource={userStats.statusGroups} 
                      columns={statusColumns}
                      rowKey={(record) => `${record.main_data_status}-${record.extra_data_status}`}
                      pagination={false}
                      style={{ marginTop: '16px' }}
                    />
                  </TabPane>
                  <TabPane 
                    tab={<span><ClockCircleOutlined />آمار روزانه</span>} 
                    key="2"
                  >
                    <div className={styles.dailyStats}>
                      {/* <Title level={5}>روند آماری روزانه</Title>
                      <div className={styles.dailyStatsChart}>
                        {userStats.overallDailyCounts
                          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                          .map((count, idx) => {
                            const maxCount = Math.max(...userStats.overallDailyCounts.map(c => c.count));
                            const intensity = Math.min((count.count / maxCount) * 100, 100);
                            const height = 20 + (intensity / 100) * 40; // Height between 20px and 60px
                            
                            return (
                              <Tooltip 
                                key={idx}
                                className={styles.rtlTooltip}
                                title={`${formatDate(count.date)}: ${count.count} مورد`}
                                placement="top"
                              >
                                <div className={styles.chartBar}>
                                  <div style={{ 
                                    width: '24px', 
                                    height: `${height}px`, 
                                    backgroundColor: `rgba(69, 123, 157, ${intensity/100 + 0.2})`, 
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                  }} />
                                  <span className={styles.chartLabel}>
                                    {formatDate(count.date).substring(5)}
                                  </span>
                                </div>
                              </Tooltip>
                            );
                          })}
                      </div> */}
                    </div>
                    <Table
                      className={styles.dailyCountTable}
                      dataSource={userStats.overallDailyCounts} 
                      columns={dailyColumns}
                      rowKey="date"
                      pagination={{ pageSize: 10 }}
                      style={{ marginTop: '16px' }}
                    />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </>
        )}
        
        {!loading && !userStats && !error && (
          <Empty 
            description="لطفا یک نام کاربری را جستجو کنید"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: '100px auto' }}
          />
        )}
      </div>
    </ConfigProvider>
  );
};

export default UserStats; 