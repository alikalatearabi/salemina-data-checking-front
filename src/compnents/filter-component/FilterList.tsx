import { 
  QuestionCircleOutlined, 
  LoadingOutlined, 
  SearchOutlined,
  ClearOutlined,
  ScanOutlined,
  ImportOutlined
} from "@ant-design/icons";
import { Button, Input, Popover, Select } from "antd";
import { useState, useEffect } from "react";
import styles from "./FilterList.module.scss";
import axios from "axios";

const { Option } = Select;

const FilterList: React.FC<{ onApplyFilters: (filters: Record<string, string | number | undefined>) => void }> = ({ onApplyFilters }) => {
    const [importer, setImporter] = useState<string>("");
    const [barcode, setBarcode] = useState<string>("");
    const [mainDataStatus, setMainDataStatus] = useState<number | undefined>(undefined);
    const [extraDataStatus, setExtraDataStatus] = useState<number | undefined>(undefined);
    const [cluster, setCluster] = useState<string | undefined>(undefined);
    const [childCluster, setChildCluster] = useState<string | undefined>(undefined);

    const [clusters, setClusters] = useState<string[]>([]);
    const [childClusters, setChildClusters] = useState<string[]>([]);
    const [isChildClusterDisabled, setIsChildClusterDisabled] = useState<boolean>(true);
    const [isLoadingClusters, setIsLoadingClusters] = useState<boolean>(false);
    const [isLoadingChildClusters, setIsLoadingChildClusters] = useState<boolean>(false);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    useEffect(() => {
        const fetchClusters = async () => {
            setIsLoadingClusters(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/distinct-clusters`);
                setClusters(response.data.clusters || []);
            } catch (error) {
                console.error("Error fetching clusters:", error);
            } finally {
                setIsLoadingClusters(false);
            }
        };

        fetchClusters();
    }, []);

    useEffect(() => {
        if (cluster) {
            const fetchChildClusters = async () => {
                setIsLoadingChildClusters(true);
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/distinct-child-clusters`, {
                        params: { cluster },
                    });
                    setChildClusters(response.data.childClusters || []);
                    setIsChildClusterDisabled(false);
                } catch (error) {
                    console.error("Error fetching child clusters:", error);
                } finally {
                    setIsLoadingChildClusters(false);
                }
            };

            fetchChildClusters();
        } else {
            setChildClusters([]);
            setChildCluster(undefined);
            setIsChildClusterDisabled(true);
        }
    }, [cluster]);

    const searchDataHandler = () => {
        onApplyFilters({
            importer: importer || undefined,
            barcode: barcode || undefined,
            main_data_status: mainDataStatus,
            extra_data_status: extraDataStatus,
            cluster: cluster || undefined,
            child_cluster: childCluster || undefined,
        });
    };

    const clearFilters = () => {
        setImporter("");
        setBarcode("");
        setMainDataStatus(undefined);
        setExtraDataStatus(undefined);
        setCluster(undefined);
        setChildCluster(undefined);
    };

    return (
        <div className={styles.filterList}>
            <div className={styles.header}>
                <Button onClick={() => setIsCollapsed(!isCollapsed)} className={styles.collapseButton}>
                    {isCollapsed ? "نمایش فیلترها" : "پنهان کردن فیلترها"}
                </Button>
                <div className={styles.helpIcon}>
                    <Popover content={PopoverContent} title={null} trigger="hover">
                        <QuestionCircleOutlined />
                    </Popover>
                </div>
            </div>
            <div className={`${styles.filtersSection} ${isCollapsed ? styles.collapsed : ""}`}>
                <div className={styles.filtersWrapper}>
                    <div className={styles.filterItem}>
                        <Input
                            placeholder="نام واردکننده"
                            value={importer}
                            onChange={(e) => setImporter(e.target.value)}
                            className={styles.filterInput}
                            aria-label="نام واردکننده"
                            prefix={<ImportOutlined style={{ color: '#a0aec0', marginLeft: 8 }} />}
                        />
                    </div>
                    <div className={styles.filterItem}>
                        <Input
                            placeholder="بارکد محصول"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            className={styles.filterInput}
                            aria-label="بارکد محصول"
                            prefix={<ScanOutlined style={{ color: '#a0aec0', marginLeft: 8 }} />}
                        />
                    </div>
                    <div className={styles.filterItem}>
                        <Select
                            placeholder="وضعیت داده اصلی"
                            value={mainDataStatus}
                            onChange={(value: number) => setMainDataStatus(value)}
                            className={styles.filterSelect}
                            allowClear
                            suffixIcon={isLoadingClusters ? <LoadingOutlined /> : null}
                        >
                            <Option value={2}>2</Option>
                            <Option value={3}>3</Option>
                            <Option value={7}>7</Option>
                            <Option value={11}>11</Option>
                        </Select>
                    </div>
                    <div className={styles.filterItem}>
                        <Select
                            placeholder="وضعیت داده اضافی"
                            value={extraDataStatus}
                            onChange={(value: number) => setExtraDataStatus(value)}
                            className={styles.filterSelect}
                            allowClear
                            suffixIcon={isLoadingClusters ? <LoadingOutlined /> : null}
                        >
                            <Option value={3}>3</Option>
                            <Option value={7}>7</Option>
                        </Select>
                    </div>
                    <div className={styles.filterItem}>
                        <Select
                            placeholder="خوشه"
                            value={cluster}
                            onChange={(value) => setCluster(value)}
                            className={styles.filterSelect}
                            allowClear
                            loading={isLoadingClusters}
                            suffixIcon={isLoadingClusters ? <LoadingOutlined /> : null}
                        >
                            {clusters.map((c) => (
                                <Option key={c} value={c}>
                                    {c}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className={styles.filterItem}>
                        <Select
                            placeholder="زیر خوشه"
                            value={childCluster}
                            onChange={(value) => setChildCluster(value)}
                            className={styles.filterSelect}
                            allowClear
                            disabled={isChildClusterDisabled}
                            loading={isLoadingChildClusters}
                            suffixIcon={isLoadingChildClusters ? <LoadingOutlined /> : null}
                        >
                            {childClusters.map((cc) => (
                                <Option key={cc} value={cc}>
                                    {cc}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <Button className={styles.searchButton} onClick={searchDataHandler} icon={<SearchOutlined />}>
                        جست و جو
                    </Button>
                    <Button className={styles.clearButton} onClick={clearFilters} icon={<ClearOutlined />}>
                        پاک کردن فیلترها
                    </Button>
                </div>
            </div>
        </div>
    );
};

const PopoverContent = (
    <div style={{ fontSize: "14px", padding: "8px 4px" }}>
        برای برگشت تمام داده ها، بدون فیلتر جست و جو کنید
    </div>
);

export default FilterList;
