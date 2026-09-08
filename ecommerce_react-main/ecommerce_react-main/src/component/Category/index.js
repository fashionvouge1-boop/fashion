import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

import SkeletonLoader from "../SkeletonLoader";
import ProductCard from "../ProductCard";
import {useAuth} from "../../contexts/AuthContext";
import { API_URL } from "../../config";

const CategoryPage = () => {
    const {id} = useParams();
    const [productsArray, setProductsArray] = useState([]);
    const [totelData, setTotelData] = useState(20);
    const [hasMore, setHasMore] = useState(true);
    const [isLoader, setIsLoader] = useState(false);
    const [page, setPage] = useState(1);
    const {setCategory} = useAuth();

    useEffect(() => {
        axios
            .get(`${API_URL}/api/category/${id}`)
            .then(function (response) {
                // handle success
                if (response.data.data && response.data.statusCode === 1) {
                    setCategory(response.data.data);
                }
            })
            .catch(function (error) {
                // handle error
                setCategory({});
            });
    }, []);

    const handleProductData = () => {
        if (productsArray?.length >= totelData && page > 1) {
            setHasMore(false);
            setIsLoader(false);
            return;
        }
        let url = `${API_URL}/api/products/get?limit=20&page=${page}`;
        if (id) {
            url += `&category=${id}`;
        }
        axios
            .get(url)
            .then(function (response) {
                // handle success
                const responseData = response?.data;
                const products = Array.isArray(responseData)
                    ? responseData
                    : Array.isArray(responseData?.data)
                        ? responseData.data
                        : [];
                if (products.length > 0) {
                    setProductsArray((prev) => [...prev, ...products]);
                } else {
                    setHasMore(false);
                    setIsLoader(true);
                }
                if (responseData?.total) {
                    setTotelData(responseData.total);
                }
                if (responseData?.total && products.length === responseData.total) {
                    setHasMore(true);
                }
            })
            .catch(function (error) {
                // handle error
                console.log("---- error", error);
                setProductsArray([]);
                setHasMore(false);
                setIsLoader(false);
            });
    };

    useEffect(() => {
        setIsLoader(true);
        handleProductData();
    }, [page, id]);

    return (
        <InfiniteScroll
            scrollableTarget={document.getElementsByTagName('html')}
            dataLength={productsArray?.length || 20}
            next={() => {
                if (hasMore) {
                    setPage((prev) => prev + 1);
                }
            }}
            hasMore={hasMore}
            loader={
                <Row xs={2} md={2} className="g-2 m-0">
                    <Col>
                        <SkeletonLoader/>
                    </Col>
                    <Col>
                        <SkeletonLoader/>
                    </Col>
                    <Col>
                        <SkeletonLoader/>
                    </Col>
                    <Col>
                        <SkeletonLoader/>
                    </Col>
                </Row>
            }
        >
            <Row xs={2} md={2} className="g-0 mt-2">
                {isLoader && productsArray.length === 0 ? (
                    <>
                        <Col>
                            <SkeletonLoader/>
                        </Col>
                        <Col>
                            <SkeletonLoader/>
                        </Col>
                        <Col>
                            <SkeletonLoader/>
                        </Col>
                        <Col>
                            <SkeletonLoader/>
                        </Col>
                    </>
                ) : (
                    productsArray?.map((item, index) => (
                        <ProductCard item={item} index={index} key={item._id || item.id || index}/>
                    ))
                )}
            </Row>
            {isLoader && !hasMore && productsArray?.length !== 0 && (
                <div className="my-5">
                    <h3
                        style={{
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#727272",
                            textAlign: "center",
                        }}
                    >
                        No Data Found!!
                    </h3>
                </div>
            )}
        </InfiniteScroll>
    );
};

export default CategoryPage;
