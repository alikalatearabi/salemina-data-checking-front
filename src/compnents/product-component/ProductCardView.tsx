import { useEffect, useState } from "react";
import { Button, Card, Pagination, notification, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Product, updateProduct } from "../../api/product";
import { useData } from "../../store/dataContext";
import EditProductModal from "./EditProductModal";
import styles from "./productCardViewStyle.module.scss";

const { Meta } = Card;

const ProductCardView: React.FC<{ filters: Record<string, string | undefined> }> = ({ filters }) => {
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
                const product = {...selectedProduct, "monitor": username}
                await updateProduct(product);
                notification.success({
                    message: "Update Successful",
                    description: "Product updated successfully.",
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
            setSelectedProduct({ ...selectedProduct, [key]: value });
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
                                {product.picture_old ? (
                                    <img
                                        alt={product.product_name}
                                        src={product.picture_old}
                                        onError={(e) => (e.currentTarget.style.display = "none")}
                                    />
                                ) : (
                                    <div style={{
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <p>عکس محصول موجود نیست</p>
                                    </div>
                                )}
                            </div>
                        }
                    >
                        <Meta
                            title={product.product_name}
                            description={
                                <div className={styles.metaDescription}>
                                    <div>بارکد: {product.barcode}</div>
                                    <div>وضعیت داده‌های اصلی: {product.Main_data_status}</div>
                                    <div>وضعیت داده‌های اضافی: {product.Extra_data_status}</div>
                                </div>
                            }
                        />
                        <div className={styles.cardButtonContainer}>
                            <Button type="primary" onClick={() => handleEdit(product)}>
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