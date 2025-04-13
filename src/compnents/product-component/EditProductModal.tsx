import React, { useEffect, useState } from "react";
import moment from "moment-jalaali";
import { Modal, Input, Button, Select, Divider, Typography } from "antd";
import axios from "axios";
import { Product } from "../../api/product";
import styles from "./EditProductModal.module.scss";
import { CloseOutlined, CheckCircleFilled } from "@ant-design/icons";

const { Title } = Typography;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface EditProductModalProps {
  visible: boolean;
  product: Product | null;
  onCancel: () => void;
  onSave: () => void;
  onChange: (key: string, value: string) => void;
}

const excludedFields = [
  "_id",
  "main_data_status",
  "extra_data_status",
  "picture_old",
  "picture_new",
  "picture_main_info",
  "picture_extra_info",
  "createdAt",
  "updatedAt",
  "__v",
];

const imageFields = [
  { key: "picture_old", label: "Old Picture" },
  { key: "picture_new", label: "New Picture" },
  { key: "picture_main_info", label: "Main Info Picture" },
  { key: "picture_extra_info", label: "Extra Info Picture" },
];

const EditProductModal: React.FC<EditProductModalProps> = ({
  visible,
  product,
  onCancel,
  onSave,
  onChange,
}) => {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [clusters, setClusters] = useState<string[]>([]);
  const [childClusters, setChildClusters] = useState<string[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedChildCluster, setSelectedChildCluster] = useState<string | null>(null);
  const [newCluster, setNewCluster] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 992 && window.innerWidth > 576);

  useEffect(() => {
    if (visible) {
      if (product && product["cluster"]) {
        setSelectedCluster(product["cluster"]);
      } else if (product && product["cluster"] === "") {
        setSelectedCluster(null);
      }
      axios
        .get(`${API_BASE_URL}/distinct-clusters`)
        .then((response) => {
          if (response.data && Array.isArray(response.data.clusters)) {
            const filteredClusters = response.data.clusters.filter(
              (cluster: string) => cluster.trim() !== ""
            );
            setClusters(filteredClusters);
          }
        })
        .catch((error) => {
          console.error("Error fetching clusters:", error);
        });
    }
  }, [visible, product]);

  useEffect(() => {
    if (selectedCluster) {
      axios
        .get(`${API_BASE_URL}/distinct-child-clusters?cluster=${selectedCluster}`)
        .then((response) => {
          if (response.data && Array.isArray(response.data.childClusters)) {
            setChildClusters(response.data.childClusters);
          }
        })
        .catch((error) => {
          console.error("Error fetching child clusters:", error);
        });
    } else {
      setChildClusters([]);
    }
  }, [selectedCluster]);

  const handleClusterChange = (value: string | string[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    if (newValue) {
      if (!clusters.includes(newValue)) {
        setClusters([...clusters, newValue]);
      }
      setSelectedCluster(newValue);
      onChange("cluster", newValue);
    } else {
      setSelectedCluster(null);
      setSelectedChildCluster(null);
      onChange("cluster", "");
    }
  };

  const handleChildClusterChange = (value: string | string[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    if (newValue) {
      if (!childClusters.includes(newValue)) {
        setChildClusters([...childClusters, newValue]);
      }
      setSelectedChildCluster(newValue);
      onChange("child_cluster", newValue);
    } else {
      setSelectedChildCluster(null);
      onChange("child_cluster", "");
    }
  };

  const handleAddCluster = () => {
    if (newCluster.trim() && !clusters.includes(newCluster)) {
      setClusters([...clusters, newCluster]);
      setSelectedCluster(newCluster);
      onChange("cluster", newCluster);
    }
    setNewCluster("");
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setImageModalVisible(false);
  };

  // Add window resize event listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
      setIsTablet(window.innerWidth <= 992 && window.innerWidth > 576);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Modal
        width={isMobile ? "95%" : isTablet ? "90%" : "90%"}
        title={<Title level={isMobile ? 5 : 4}>Edit Product Details</Title>}
        open={visible}
        onCancel={onCancel}
        footer={[
          <div key="note" style={{ 
            textAlign: 'left', 
            marginRight: 'auto', 
            color: '#52c41a', 
            display: 'flex', 
            alignItems: 'center',
            fontSize: isMobile ? '12px' : '14px',
            flexGrow: 1
          }}>
            <CheckCircleFilled style={{ marginRight: 8 }} /> Saving will mark this product as checked
          </div>,
          <Button key="cancel" onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={onSave} className={styles.saveButton}>
            Save Changes
          </Button>
        ]}
        destroyOnClose
        centered
        bodyStyle={{ padding: isMobile ? '12px' : '20px' }}
        style={{ top: isMobile ? 10 : 20 }}
      >
        {product && (
          <div className={styles.editProductContainer}>
            <div className={styles.imagesColumn}>
              {imageFields.map(({ key, label }) => (
                <div key={key} className={styles.imageField}>
                  <h4>{label}</h4>
                  {product[key as keyof Product] ? (
                    <img
                      src={product[key as keyof Product] as string}
                      alt={label}
                      className={styles.image}
                      onClick={() =>
                        handleImageClick(product[key as keyof Product] as string)
                      }
                    />
                  ) : (
                    <div className={styles.noImage}>No Image Available</div>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.formColumn}>
              <div className={styles.fieldsContainer}>
                <div className={styles.sectionDivider}>Basic Information</div>
                
                {Object.keys(product)
                  .filter(key => ['name', 'label', 'barcode', 'price', 'price_unit', 'color', 'weight', 'cluster', 'child_cluster'].includes(key))
                  .map((key) => renderField(key))}
                
                <div className={styles.sectionDivider}>Additional Details</div>
                
                {Object.keys(product)
                  .filter(key => 
                    !excludedFields.includes(key) && 
                    !['name', 'label', 'barcode', 'price', 'price_unit', 'color', 'weight', 'cluster', 'child_cluster', 'createdAt', 'updatedAt'].includes(key)
                  )
                  .map((key) => renderField(key))}
                
                <div className={styles.sectionDivider}>System Information</div>
                
                {product.createdAt && (
                  <div className={styles.field}>
                    <label>Creation Date</label>
                    <Input
                      value={moment(product.createdAt).format("jYYYY/jMM/jDD HH:mm")}
                      readOnly
                      className={styles.dateField}
                    />
                  </div>
                )}
                {product.updatedAt && (
                  <div className={styles.field}>
                    <label>Last Updated</label>
                    <Input
                      value={moment(product.updatedAt).format("jYYYY/jMM/jDD HH:mm")}
                      readOnly
                      className={styles.dateField}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={imageModalVisible}
        onCancel={closeImageModal}
        footer={null}
        width={isMobile ? "95vw" : isTablet ? "80vw" : "70vw"}
        centered
        destroyOnClose
        bodyStyle={{ padding: 0, backgroundColor: 'transparent' }}
        style={{ top: isMobile ? 10 : 20 }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        closeIcon={
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            style={{ 
              color: 'white', 
              fontSize: isMobile ? '16px' : '18px', 
              position: 'absolute', 
              top: 10, 
              right: 10, 
              zIndex: 1000,
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '50%',
              width: isMobile ? '32px' : '36px',
              height: isMobile ? '32px' : '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} 
          />
        }
      >
        {selectedImage && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '20px',
            height: '80vh',
            width: '100%'
          }}>
            <img
              src={selectedImage}
              alt="Enlarged"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
              }}
            />
          </div>
        )}
      </Modal>
    </>
  );
  
  function renderField(key: string) {
    return (
      <div key={key} className={styles.field}>
        <label>{key.replace(/_/g, " ")}</label>
        {key === "cluster" ? (
          <Select
            value={selectedCluster}
            onChange={handleClusterChange}
            mode="tags"
            allowClear
            style={{ width: "100%", direction: "rtl" }}
            dropdownStyle={{ direction: "rtl" }}
            dropdownRender={(menu) => (
              <>
                <div style={{ padding: 8 }}>
                  <Input
                    placeholder="دسته‌بندی جدید..."
                    value={newCluster}
                    onChange={(e) => setNewCluster(e.target.value)}
                    onPressEnter={handleAddCluster}
                  />
                  <Button
                    onClick={handleAddCluster}
                    className={styles.addClusterButton}
                  >
                    افزودن
                  </Button>
                </div>
                <Divider style={{ margin: "4px 0" }} />
                {menu}
              </>
            )}
            placeholder="یک دسته‌بندی انتخاب کنید"
            showSearch
            filterOption={(input, option) => 
              (option?.label as string).toLowerCase().includes(input.toLowerCase())
            }
            optionFilterProp="label"
            options={clusters.map((cluster) => ({
              value: cluster,
              label: cluster,
            }))}
          />
        ) : key === "child_cluster" ? (
          <Select
            value={selectedChildCluster}
            onChange={handleChildClusterChange}
            mode="tags"
            style={{ width: "100%", direction: "rtl" }}
            dropdownStyle={{ direction: "rtl" }}
            placeholder="یک زیر دسته‌بندی انتخاب کنید"
            disabled={!selectedCluster}
            showSearch
            filterOption={(input, option) => 
              (option?.label as string).toLowerCase().includes(input.toLowerCase())
            }
            optionFilterProp="label"
            options={childClusters.map((child) => ({
              value: child,
              label: child,
            }))}
          />
        ) : (
          <Input
            value={(product as any)[key]}
            onChange={(e) => onChange(key, e.target.value)}
          />
        )}
      </div>
    );
  }
};

export default EditProductModal;
