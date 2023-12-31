import React, { useEffect, useState } from 'react';
import axios from '../Token/Interceptor';
import Header from '../../components/Base/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../../styles/Notice/NoticeView.css';
import Moment from 'react-moment';

const NoticeView = () => {
  const location = useLocation();
  const id = location.state.id;
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [editButton, setEditButton] = useState();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('kr-KO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    axios
      .get(`/api/notice/view/${id}`)
      .then((res) => {
        console.log(res.data);
        setNotice(res.data.data);
        setEditButton(!res.data.responseMessage.includes('NOTICE_WRITER_ACCESS_FAILED'));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const noticeModifyHandler = () => {
    navigate('/notice/modify', { state: notice });
  };

  const noticeDeleteHandler = () => {
    const data = {
      id: notice.id,
    };
    axios
      .post('/api/notice/delete', JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        const responseData = response.data;

        alert('글을 삭제했습니다.');
        navigate('/notice', { state: responseData });
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
        alert('글을 삭제하지 못했습니다.');
      });
  };

  return (
    <div>
      <Header />
      {notice && (
        <div align="center" className="notice-view-board">
          <div className="notice-title">공지사항</div>
          <table className="notice-view-table">
            <tbody>
              <tr className="notice-view-title">
                <td>{notice.title}</td>
              </tr>
              <tr>
                <div className="view-member-id">
                  <td className="view-member-id2">작성자</td>
                  <td>{notice.member.name}</td>
                </div>
                <tr className="view-created-date">
                  <td className="view-created-date2">작성일시</td>
                  <td className="view-created-date3">
                    <Moment format="YYYY년 MM월 DD일 HH:mm">{notice.createdDate}</Moment>
                  </td>
                </tr>
              </tr>

              <tr className="view-content">
                <td style={{ overflowWrap: "break-word" }}>{notice.content}</td>
              </tr>
            </tbody>
          </table>

          <div className="view-buttons">
            {editButton && (
              <div>
                <Button
                  variant="contained"
                  size="medium"
                  color="inherit"
                  onClick={noticeModifyHandler}
                  sx={{ marginRight: '15px' }}
                >
                  수정하기
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  color="error"
                  onClick={noticeDeleteHandler}
                  sx={{ marginRight: '15px' }}
                >
                  삭제하기
                </Button>
              </div>
            )}
          </div>
          <Button
            sx={{ justifyContent: 'right' }}
            variant="contained"
            size="medium"
            color="inherit"
            onClick={() => {
              navigate('/notice');
            }}
          >
            목록보기
          </Button>
        </div>
      )}
    </div>
  );
};
export default NoticeView;
