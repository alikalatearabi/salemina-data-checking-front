import React, { useEffect, useState } from "react";
import moment from "moment-jalaali";
import { Modal, Input, Button, Select, Divider } from "antd";
import axios from "axios";
import { Product } from "../../api/product";
import styles from "./EditProductModal.module.scss";

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

  useEffect(() => {
    if (visible) {
      if (product && product["cluster"]) {
        setSelectedCluster(product["cluster"]);
      } else {
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

  return (
    <>
      <Modal
        width="800px"
        title="Edit Product"
        open={visible}
        onCancel={onCancel}
        footer={
          <div className={styles.modalFooter}>
            <Button key="cancel" onClick={onCancel}>
              Cancel
            </Button>
            <Button key="save" type="primary" onClick={onSave}>
              Save
            </Button>
          </div>
        }
        destroyOnClose
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
                    <p>No Image Available</p>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.formColumn}>
              <div className={styles.fieldsContainer}>
                {Object.keys(product)
                  .filter((key) => !excludedFields.includes(key))
                  .map((key) => (
                    <div key={key} className={styles.field}>
                      <label>{key.replace(/_/g, " ")}:</label>
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
                                  type="link"
                                  onClick={handleAddCluster}
                                  style={{
                                    margin: "5px auto",
                                    width: "100%",
                                    backgroundColor: "#457b9d",
                                    color: "white",
                                  }}
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
                  ))}

                {product.createdAt && (
                  <div className={styles.field}>
                    <label>تاریخ ایجاد:</label>
                    <Input
                      value={moment(product.createdAt).format("jYYYY/jMM/jDD HH:mm")}
                      readOnly
                    />
                  </div>
                )}
                {product.updatedAt && (
                  <div className={styles.field}>
                    <label>تاریخ بروزرسانی:</label>
                    <Input
                      value={moment(product.updatedAt).format("jYYYY/jMM/jDD HH:mm")}
                      readOnly
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
        width="40vw"
        centered
        destroyOnClose
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Enlarged"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "8px",
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default EditProductModal;
