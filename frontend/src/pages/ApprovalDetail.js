import React, { useState, useEffect } from 'react';
import '../assets/bootstrap/css/bootstrap.min.css';
import '../assets/css/animate.min.css'
import {useParams, useNavigate} from 'react-router-dom';
import { SelectApprovalDetailApi, UpdateApprovalApi } from '../api/Approval';
import { useForm } from 'react-hook-form';

function ApprovalDetail() {
    const {id} = useParams();
    const [isMobile, setIsMobile] = useState(false);
    const [hoverAnimationList, setHoverAnimationList] = useState([]);
    const [detail,setDetail] = useState({});
    const { register, formState: { errors }, handleSubmit } = useForm();
    const { register: register1, formState: { errors: errors1 }, handleSubmit: handleSubmit1 } = useForm();
    const navigate = useNavigate();
    const navigateToCompleteList = () => {
        navigate("/approval-complete");
    };
    const navigateToApproval = () => {
        navigate("/approval");
    };
    const onValid = async ({approvalCheck}) => {
        await UpdateApprovalApi(id,{approvalCheck})
        .then((res) => {
            if (res.status === 200) {
                alert('처리완료')
                return navigate("/approval-complete");
            }
        })
        .catch((err) => {
            alert('권한이 없습니다.')
            console.log("err", err);
        })
    };
    const onValid1 = async ({approvalCheck}) => {
        await UpdateApprovalApi(id,{approvalCheck})
        .then((res) => {
            if (res.status === 200) {
                alert('처리완료')
                return navigate("/approval");
            }
        })
        .catch((err) => {
            alert('권한이 없습니다.')
            console.log("err", err);
        })
    };
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await SelectApprovalDetailApi(id);
                setDetail(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const getWidth = () => {
            return window.innerWidth;
        };

        setIsMobile(getWidth() < 768);

        const elements = document.querySelectorAll('[data-bss-hover-animate]');
        setHoverAnimationList(elements);

        elements.forEach((element) => {
            element.addEventListener('mouseenter', () => {
            element.classList.add('animated', element.dataset.bssHoverAnimate);
            });
            element.addEventListener('mouseleave', () => {
            element.classList.remove('animated', element.dataset.bssHoverAnimate);
            });
        });
        fetchData();
    }, []);

    return (
        <div>
            <div>
              <div className="d-xxl-flex justify-content-xxl-start" style={{width: '100%', background: 'rgba(0,0,0,0)', height: '800px'}}>
                <div style={{height: '100%', width: '2%'}} />
                <div style={{height: '100%', width: '10%', background: 'rgba(13,110,253,0)', borderRight: '2px ridge rgba(128,128,128,0.32)'}}>
                  <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center" style={{background: 'rgba(102,16,242,0)', width: '100%', height: '7%'}}><button className="btn btn-primary" data-bss-hover-animate="pulse" type="button" style={{background: 'rgba(13,110,253,0)', width: 'auto', height: 'auto', color: 'black', border: '1px ridge black'}}>새 결재 진행</button></div>
                  <div className="d-xxl-flex" style={{width: '100%', height: 'auto', background: 'rgba(220,53,69,0)'}}><span className="d-xxl-flex" style={{width: 'auto', height: 'auto', fontWeight: 'bold', fontSize: '20px'}}>결재하기</span></div>
                  <div style={{width: '100%', background: 'rgba(214,51,132,0)', height: '7%'}}><button className="btn btn-primary text-start d-xxl-flex justify-content-xxl-start" data-bss-hover-animate="pulse" type="button" onClick={ navigateToApproval } style={{background: 'rgba(13,110,253,0)', borderStyle: 'none', color: 'black', width: 'auto', height: 'auto', paddingRight: '12px', paddingLeft: '0px'}}>결재 대기 문서</button><button className="btn btn-primary d-xxl-flex" data-bss-hover-animate="pulse" type="button" onClick={ navigateToCompleteList } style={{background: 'rgba(13,110,253,0)', borderStyle: 'none', color: 'black', width: 'auto', height: 'auto', paddingLeft: '0px'}}>결재 완료 문서</button></div>
                </div>
                <div style={{width: '88%', height: '90%'}}>
                  <div style={{background: 'rgba(220,53,69,0)', height: '82%', width: '100%'}}>
                    <div style={{width: '88%', height: '100%'}}>
                      <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center" style={{background: 'rgba(13,110,253,0)', width: '100%', height: '70px'}}>
                        <div style={{height: '100%', width: '4%', background: 'rgba(220,53,69,0)'}} /><span style={{width: 'auto', height: 'auto', fontWeight: 'bold', fontSize: '30px'}}>결재</span>
                      </div>
                      <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center" style={{background: 'rgba(13,110,253,0)', width: '100%', height: '10%'}}>
                        <div style={{height: '100%', width: '4%', background: 'rgba(220,53,69,0)'}} />
                        <div style={{height: '100%', width: '45%'}}>
                          <div className="d-xxl-flex align-items-xxl-center" style={{width: '100%', height: '60%', borderTop: '2px ridge rgba(128,128,128,0.32)', borderBottomWidth: '0px'}}><span style={{width: 'auto', height: 'auto', fontWeight: 'bold'}}>{detail.approvalSubject}</span></div>
                          <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center" style={{width: '100%', height: '40%', borderBottom: '2px ridge rgba(128,128,128,0.32)'}}>
                            <div style={{height: 'auto', width: '90px', borderRight: '2px ridge rgba(128,128,128,0.32)'}}><span className="d-xxl-flex justify-content-xxl-start align-items-xxl-center" style={{fontSize: '11px'}}>{detail.approvalDrafter}</span></div>
                            <div className="d-xxl-flex align-items-xxl-end" style={{height: 'auto', width: '75px', borderRight: '2px ridge rgba(128,128,128,0.32)'}}>
                              <div style={{height: '100%', width: '10%'}} /><span className="d-xxl-flex justify-content-xxl-start align-items-xxl-center" style={{fontSize: '11px'}}>{detail.approvalUpLoadDate}</span>
                            </div>
                            <div className="d-xxl-flex align-items-xxl-end" style={{height: 'auto', width: '75px'}}>
                              <div style={{height: '100%', width: '10%'}} /><span className="d-xxl-flex justify-content-xxl-start align-items-xxl-center" style={{fontSize: '11px'}}></span>
                            </div>
                          </div>
                        </div>
                        <div style={{height: '100%', width: '47%'}}>
                          <div className="d-xxl-flex justify-content-xxl-end align-items-xxl-center" style={{width: '85%', height: '60%', borderTop: '2px ridge rgba(128,128,128,0.32)'}}><button className="btn btn-primary" data-bss-hover-animate="pulse" type="button" style={{background: 'rgba(13,110,253,0)', color: 'black', borderStyle: 'none'}}>첨부파일(0)</button></div>
                          <div className="d-xxl-flex justify-content-xxl-end align-items-xxl-center" style={{width: '85%', height: '40%', borderBottom: '2px ridge rgba(128,128,128,0.32)'}}>
                            <div style={{height: 'auto', width: '70px', borderRight: '2px ridge rgba(128,128,128,0.32)'}}><span className="d-xxl-flex justify-content-xxl-start align-items-xxl-center" style={{fontSize: '11px'}}>결재권자</span></div>
                            <div className="d-xxl-flex align-items-xxl-end" style={{height: 'auto', width: '70px', borderRight: '2px ridge rgba(128,128,128,0.32)'}}>
                              <div style={{height: '100%', width: '10%'}} /><span className="d-xxl-flex justify-content-xxl-start align-items-xxl-center" style={{fontSize: '11px'}} />
                            </div><span className="d-xxl-flex justify-content-xxl-start align-items-xxl-center" style={{fontSize: '11px'}}>{detail.approvalCheckMan}</span>
                            <div className="d-xxl-flex align-items-xxl-end" style={{height: 'auto', width: '40px'}}>
                              <div style={{height: '100%', width: '10%'}} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-xxl-flex justify-content-xxl-start" style={{width: '100%', height: '87%'}}>
                        <div style={{width: '4%', height: '100%'}} />
                        <div style={{width: '85%', height: '85%'}}>
                          <div style={{width: '100%', height: '3%'}} /><textarea style={{width: '100%', height: '100%'}} defaultValue={detail.approvalContent} readOnly/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-xxl-flex justify-content-xxl-center align-items-xxl-center">
                    <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center" style={{width: '50%', height: '100%', marginLeft: '3%'}}>
                    <form onSubmit={ handleSubmit(onValid) }>
                    <button className="btn btn-primary" data-bss-hover-animate="pulse" type="submit"{...register('approvalCheck')} value={"결재완료"} style={{background: 'rgba(13,110,253,0)', width: '100px', height: 'auto', color: 'black', border: '1px ridge black', marginLeft: '10%'}}>승인</button>
                    </form>
                    <form onSubmit={ handleSubmit1(onValid1) }>
                    <button className="btn btn-primary" data-bss-hover-animate="pulse" type="submit" {...register1('approvalCheck')} value={"결재반려"} style={{background: 'rgba(13,110,253,0)', width: '100px', height: 'auto', color: 'black', border: '1px ridge black', marginLeft: '20px'}}>반려</button>
                    </form>
                    </div>
                    <div style={{width: '50%', height: '100%'}} />
                  </div>
                </div>
              </div>
            </div>
        </div>
    )
};

export default ApprovalDetail;