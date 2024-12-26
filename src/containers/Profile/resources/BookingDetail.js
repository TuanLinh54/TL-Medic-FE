import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import DatePicker from "../../../components/Input/DatePicker";
import { getUserAppointments } from "../../../services/userService";
import moment from "moment";
import { LANGUAGES } from "../../../utils";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { useNavigate } from "react-router-dom";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const BookingDetail = () => {
    const [currentDate, setCurrentDate] = useState(moment(new Date()).startOf("day").valueOf());
    const [dataPatient, setDataPatient] = useState([]);
    const [isShowLoading, setIsShowLoading] = useState(false);
    const [previewImgURL, setPreviewImgURL] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const { language, user } = useSelector((state) => ({
        language: state.app.language,
        user: state.user.userInfo,
    }));

    useEffect(() => {
        if (!user || !user.id) {
            return; // Nếu không có user, không làm gì
        }

        const getDataPatient = async () => {
            setIsShowLoading(true); // Bắt đầu loading
            try {
                let formatedDate = new Date(currentDate).getTime();

                // Gọi API để lấy lịch hẹn và thông tin bác sĩ
                const res = await getUserAppointments({
                    userId: user.id,
                    date: formatedDate,
                });
                console.log("check res", res);

                if (res && res.errCode === 0) {
                    setDataPatient(res.data);
                } else {
                    setDataPatient([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu lịch khám:", error);
            } finally {
                setIsShowLoading(false); // Kết thúc loading
            }
        };

        getDataPatient();
    }, [currentDate, user]);
    console.log(dataPatient);

    const handleOnChangeDatePicker = (date) => {
        setCurrentDate(date[0]);
    };

    return (
        <>
            <LoadingOverlay
                active={isShowLoading}
                spinner={<ClimbingBoxLoader color={"#86e7d4"} size={15} />}
            >
                <div className="manage-patient-container">
                    <div className="m-p-title font-weight-bold">
                        LỊCH KHÁM ĐÃ ĐẶT
                    </div>
                    <div className="manage-patient-body row">
                        <div className="col-4 form-group">
                            <label><FormattedMessage id={"manage-patient.choose-date"} /></label>
                            <DatePicker
                                onChange={handleOnChangeDatePicker}
                                className="form-control"
                                value={currentDate}
                            />
                        </div>
                        <div className="col-12 table-manage-patient">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th><FormattedMessage id={"manage-patient.examination-time"} /></th>
                                        <th><FormattedMessage id={"manage-patient.patient-name"} /></th>
                                        <th><FormattedMessage id={"manage-patient.address"} /></th>
                                        <th><FormattedMessage id={"manage-patient.phone-number"} /></th>
                                        <th><FormattedMessage id={"manage-patient.gender"} /></th>
                                        <th><FormattedMessage id={"manage-patient.reason"} /></th>
                                        <th>Số thứ tự khám</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataPatient && dataPatient.length > 0 ? (
                                        dataPatient.map((item, index) => {
                                            const time =
                                                language === LANGUAGES.VI
                                                    ? item.timeTypeDataPatient.valueVi
                                                    : item.timeTypeDataPatient.valueEn;
                                            const gender =
                                                language === LANGUAGES.VI
                                                    ? item.patientData.genderData.valueVi
                                                    : item.patientData.genderData.valueEn;

                                            // Số thứ tự khám lấy từ API
                                            const order = item.order;

                                            return (
                                                <tr key={index}>
                                                    <td>{order ? order : index + 1}</td> {/* Hiển thị số thứ tự khám */}
                                                    <td>{time}</td>
                                                    <td>{item.patientName}</td>
                                                    <td>{item.patientAddress}</td>
                                                    <td>
                                                        {item.patientPhoneNumber ? item.patientPhoneNumber : ""}
                                                    </td>
                                                    <td>{gender}</td>
                                                    <td>{item.patientReason}</td>
                                                    <td>{item.waitingCount}</td> {/* Số người đang chờ */}
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: "center" }}>
                                                {language === LANGUAGES.VI
                                                    ? "Không có bệnh nhân đặt lịch vào ngày này"
                                                    : "No patients booked for this date"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>


                            </table>
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <Lightbox
                        mainSrc={previewImgURL}
                        onCloseRequest={() => setIsOpen(false)}
                    />
                )}
            </LoadingOverlay>
        </>
    );
};

export default BookingDetail;
