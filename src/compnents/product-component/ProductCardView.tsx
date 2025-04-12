import { useEffect, useState } from "react";
import { Button, Card, Pagination, notification, Tooltip, Badge } from "antd";
import { QuestionCircleOutlined, CheckCircleFilled, FileImageOutlined, EditOutlined } from "@ant-design/icons";
import { Product, updateProduct } from "../../api/product";
import { useData } from "../../store/dataContext";
import EditProductModal from "./EditProductModal";
import styles from "./productCardViewStyle.module.scss";

const { Meta } = Card;

const ProductCardView: React.FC<{ filters: Record<string, string | undefined | number> }> = ({ filters }) => {
    const { data, fetchData } = useData();
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const username = localStorage.getItem("username");

    const fetchFilteredData = (page: number) => {
        fetchData({ page: `${page}`, limit: `${productsPerPage}`, ...filters });
    };

    useEffect(() => {
        fetchFilteredData(currentPage);
    }, [currentPage, filters]);

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalVisible(true);
    };

    const handleSave = async () => {
        try {
            if (selectedProduct) {
                const product = { 
                    ...selectedProduct, 
                    "monitor": username,
                    "main_data_status": 2 
                }
                await updateProduct(product);
                notification.success({
                    message: "Update Successful",
                    description: "Product updated successfully and marked as checked.",
                });
                fetchFilteredData(currentPage);
            }
        } catch (error) {
            notification.error({
                message: "Update Failed",
                description: "Failed to update the product.",
            });
        }
        setIsModalVisible(false);
    };

    const handleChangeInput = (key: string, value: string) => {
        if (selectedProduct) {
            if (key === 'cluster' && value === "") {
                setSelectedProduct({ ...selectedProduct, [key]: value, "child_cluster": "" });
            } else {
                setSelectedProduct({ ...selectedProduct, [key]: value });
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div style={{ width: "100%" }}>
            <div className={styles.flexContainer}>
                {data?.data?.map((product: Product) => (
                    <Card
                        key={product._id}
                        hoverable
                        className={styles.card}
                        cover={
                            <div className={styles.cardCover}>
                                {Number(product.main_data_status) === 2 && (
                                    <Badge 
                                        count={<CheckCircleFilled style={{ color: '#52c41a' }} />}
                                        className={styles.checkedBadge}
                                    />
                                )}
                                {product.picture_old ? (
                                    <img
                                        alt={product.product_name}
                                        src={product.picture_old}
                                        onError={(e) => (e.currentTarget.style.display = "none")}
                                    />
                                ) : (
                                    <div className={styles.noImageContainer}>
                                        <FileImageOutlined />
                                        <p>عکس محصول موجود نیست</p>
                                    </div>
                                )}
                            </div>
                        }
                    >
                        <Meta
                            title={
                                <div className={styles.productTitle}>
                                    {product.product_name}
                                    {Number(product.main_data_status) === 2 && (
                                        <span className={styles.checkedStatus}>
                                            <CheckCircleFilled style={{ color: '#52c41a' }} /> Checked
                                        </span>
                                    )}
                                </div>
                            }
                            description={
                                <div className={styles.metaDescription}>
                                    <div>بارکد: {product.barcode}</div>
                                    <div>وضعیت داده‌های اصلی: {product.main_data_status}</div>
                                    <div>وضعیت داده‌های اضافی: {product.extra_data_status}</div>
                                </div>
                            }
                        />
                        <div className={styles.cardButtonContainer}>
                            <Button type="primary" onClick={() => handleEdit(product)} icon={<EditOutlined />}>
                                مشاهده یا ویرایش
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <div className={styles.paginationContainer}>
                <div className={styles.paginationWrapper}>
                    <Tooltip title={`تعداد کل محصولات: ${data?.totalProducts || 0}`}>
                        <QuestionCircleOutlined className={styles.infoIcon} />
                    </Tooltip>
                    <Pagination
                        current={currentPage}
                        total={Number(data?.totalProducts) || 0}
                        pageSize={productsPerPage}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            </div>

            <EditProductModal
                visible={isModalVisible}
                product={selectedProduct}
                onCancel={() => setIsModalVisible(false)}
                onSave={handleSave}
                onChange={handleChangeInput}
            />
        </div>
    );
};

export default ProductCardView;