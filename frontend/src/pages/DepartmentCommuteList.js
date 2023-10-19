import React, { useState, useEffect } from 'react';
import '../assets/bootstrap/css/bootstrap.min.css';
import '../assets/css/animate.min.css'
import {selectHrmListApi} from "../api/Emp";
import {useParams, useNavigate} from 'react-router-dom';


function DepartmentCommuteList() {
    const [isMobile, setIsMobile] = useState(false);
    const [hrm, setHrm] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [hoverAnimationList, setHoverAnimationList] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('all'); // Default value for job position filter
    const [selectedDepartment, setSelectedDepartment] = useState('all'); // Default value for department filter
    const navigate = useNavigate();
    const navigateToReshuffle = (id) => {
        navigate(`/reshuffle/${id}`);
    };

    const handleSearchChange = (event) => {
        setSearchName(event.target.value);
    };

    const handlePositionChange = (event) => {
        setSelectedPosition(event.target.value);
    };

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await selectHrmListApi();
                setHrm(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
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

    const filteredHrm = hrm.filter((employee) =>
        employee.empName.toLowerCase().includes(searchName.toLowerCase()) &&
        (selectedPosition === 'all' || employee.empPosition === selectedPosition) &&
        (selectedDepartment === 'all' || employee.dept === selectedDepartment)
    );

    return (
        <div>
        <div>
          <div className="d-xxl-flex justify-content-xxl-start" style={{width: '100%', height: '100%'}}>
            <div style={{height: '100%', width: '2%'}} />
            <div style={{height: '100%', width: '11%', background: 'rgba(13,110,253,0)', borderRight: '2px ridge rgba(128,128,128,0.32)'}}>
              <div style={{width: '100%', height: '2%'}} />
              <div className="d-xxl-flex" style={{width: '100%', height: 'auto', background: 'rgba(220,53,69,0)'}}><span className="d-xxl-flex" style={{width: 'auto', height: 'auto', fontWeight: 'bold', fontSize: '20px'}}>근태관리</span></div>
              <div style={{width: '100%', background: 'rgba(214,51,132,0)', height: '2000px'}}><button className="btn btn-primary text-start d-xxl-flex justify-content-xxl-start" data-bss-hover-animate="pulse" type="button" style={{background: 'rgba(13,110,253,0)', borderStyle: 'none', color: 'black', width: 'auto', height: 'auto', paddingRight: '12px', paddingLeft: '0px'}}>내 연차 내역</button><button className="btn btn-primary d-xxl-flex" data-bss-hover-animate="pulse" type="button" style={{background: 'rgba(13,110,253,0)', borderStyle: 'none', color: 'black', width: 'auto', height: 'auto', paddingLeft: '0px'}}>부서별 근태 현황</button></div>
            </div>
            <div style={{width: '87%', height: '100%'}}>

            <div className="d-xxl-flex" style={{width: 'auto', height: '100%'}}>
                <div style={{background: 'rgba(214,51,132,0)', height: '100%', width: '100%'}}>
                    <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center" style={{
                        background: 'rgba(13,110,253,0)',
                        height: '45px',
                        borderTop: '2px ridge rgba(128,128,128,0.32)',
                        borderBottom: '2px ridge rgba(128,128,128,0.32)',
                        width: '100%'
                    }}>
                        <div className="d-xxl-flex justify-content-xxl-start"
                             style={{height: '100%', width: '150px'}}/>
                        <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center"
                             style={{height: '100%', width: '14%'}}><span>이름</span></div>
                        <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center"
                             style={{height: '100%', width: '15%'}}>
                            <select className="form-select" value={selectedDepartment}
                                    onChange={handleDepartmentChange} style={{width: '150px'}}>
                                <option value="all">부서</option>
                                <option value="인사부">인사부</option>
                                <option value="재무부">재무부</option>
                                <option value="콘텐츠관리부">콘텐츠관리부</option>
                                <option value="회원관리부">회원관리부</option>
                            </select>
                        </div>
                        <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center"
                             style={{height: '100%', width: '20%'}}>
                            <select className="form-select" value={selectedPosition} onChange={handlePositionChange}
                                    style={{width: '150px'}}>
                                <option value="all">직급</option>
                                <option value="사원">사원</option>
                                <option value="대리">대리</option>
                                <option value="과장">과장</option>
                                <option value="부장">부장</option>
                            </select>
                        </div>
                        <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center"
                             style={{height: '100%', width: '24%'}}><span>이메일</span></div>
                        <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center"
                             style={{height: '100%', width: '15%'}}><span>재직상태</span></div>
                    </div>
                    <div style={{width: '100%', height: '20px'}}/>
                    <ul>
                        {filteredHrm.map((e, i) => (
                            <li key={i} style={{listStyleType: 'none'}}>
                                <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center"
                                     style={{
                                         background: 'rgba(13,110,253,0)',
                                         height: '45px',
                                         borderTop: '2px none rgba(128,128,128,0.32)',
                                         borderBottom: '2px none rgba(128,128,128,0.32)',
                                         width: '100%'
                                     }}>
                                    <div className="d-xxl-flex justify-content-xxl-start"
                                         style={{height: '100%', width: '115px'}}/>
                                    <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center"
                                         style={{height: '100%', width: '15%'}}><span>{e.empName}</span></div>
                                    <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center"
                                         style={{height: '100%', width: '15%'}}><span>{e.dept}</span></div>
                                    <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center"
                                         style={{height: '100%', width: '20%'}}><span>{e.empPosition}</span></div>
                                    <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center"
                                         style={{height: '100%', width: '25%'}}><span>{e.empEmail}</span></div>
                                    <div className="d-xxl-flex justify-content-xxl-start align-items-xxl-center"
                                         style={{height: '100%', width: '5%'}}><span>{e.empStatus}</span></div>
                                    <button
                                        className="btn btn-primary text-nowrap d-xxl-flex justify-content-xxl-center align-items-xxl-center"
                                        data-bss-hover-animate="pulse" type="button"
                                        onClick={() => navigateToReshuffle(e.empId)} style={{
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        background: 'var(--bs-btn-disabled-color)',
                                        width: 'auto',
                                        height: '80%',
                                        margin: '0px',
                                        padding: '0px',
                                        paddingRight: '9px',
                                        paddingLeft: '9px',
                                        color: 'black',
                                        border: '1px solid black'
                                    }}>근태 기록
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            </div>
          </div>
        </div>
        </div>
    )
};

export default DepartmentCommuteList;