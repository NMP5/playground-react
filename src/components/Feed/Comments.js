import React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from '../Token/Interceptor';
import Swal from 'sweetalert2';
import Avvvatars from 'avvvatars-react';

export default function Comments({ comment }) {
  // 수정삭제 마우스다운
  const optionsRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setOptionsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 클릭시 수정삭제 드랍다운
  const [optionsVisible, setOptionsVisible] = useState(false);
  const toggleDrop = () => {
    setOptionsVisible(!optionsVisible);
  };

  // 댓글수정
  const [modifyContent, setModifyContent] = useState(comment.content);
  const handleContentChange = (e) => {
    setModifyContent(e.target.value);
  };

  const modifyData = {
    id: comment.id,
    content: modifyContent,
  };

  // 댓글 수정
  const modifySave = () => {
    axios
      .post('/api/comment/modify', modifyData, {
        headers: {},
      })
      .then((res) => {
        console.log('Comment modified successfully', res.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Failed to modify comment:', error);
      });
  };

  // 댓글 수정창 나오기
  const [isEditing, setIsEditing] = useState(false);
  const toggleClickModify = () => {
    setOptionsVisible(!optionsVisible);
    setIsEditing(!isEditing);
  };

  // 댓글 삭제
  const commentDelete = () => {
    Swal.fire({
      title: '정말 삭제하시겠어요?',
      text: '삭제한 댓글은 복구할 수 없습니다',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: '취소',
      cancelButtonColor: 'gray',
      confirmButtonText: '삭제',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            '/api/comment/delete',
            { id: comment.id },
            {
              headers: {
                Authorization: localStorage.getItem('Authorization'),
              },
            }
          )
          .then((res) => {
            Swal.fire('삭제 되었습니다', '', 'success').then(() => {
              window.location.reload();
            });
          })
          .catch((error) => {
            console.error('Failed to delete comment:', error);
            Swal.fire('X', '댓글을 삭제할 수 없습니다', 'error');
          });
      }
    });
  };

  const detailDate = (a) => {
    const milliSeconds = new Date() - a;
    const seconds = milliSeconds / 1000;
    if (seconds < 60) return `방금 전`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)}분 전`;
    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}시간 전`;
    const days = hours / 24;
    if (days < 7) return `${Math.floor(days)}일 전`;
    const weeks = days / 7;
    if (weeks < 5) return `${Math.floor(weeks)}주 전`;
    const months = days / 30;
    if (months < 12) return `${Math.floor(months)}개월 전`;
    const years = days / 365;
    return `${Math.floor(years)}년 전`;
  };

  const calcDatetime = detailDate(new Date(comment.createdDate));

  return (
    <>
      <li className="border-t border-slate-200 p-4 flex flex-col gap-4 items-start">
        <div className="w-full">
          <div className="mb-2">
            <a className="flex items-center gap-3 justify-between">
              <Avvvatars value={comment.userId} style="shape" size={40} />
              <div>
                <div className="flex itesms-center gap-1">
                  <p className="text-xs font-bold text-slate-900">{comment.nickname}</p>
                </div>
                <p className="text-xs text-slate-700">
                  <span>{calcDatetime}</span>
                </p>
              </div>
              <div className="flex-grow"></div> {/* 빈 공간을 채우기 위한 추가 요소 */}
              {comment.editable && (
                <button onClick={toggleDrop}>
                  <i class="fa-solid fa-ellipsis-vertical"></i>
                </button>
              )}
              <div className="relative" style={{ alignItems: 'right' }}>
                {optionsVisible && (
                  <div
                    ref={optionsRef}
                    className="absolute right-0 shadow-lg bg-white rounded border border-slate-300 transform opacity-100 scale-100"
                  >
                    <button type="button" className="py-2 px-4 hover:bg-slate-50" onClick={toggleClickModify}>
                      <span className="text-slate-900 text-sm text-keep whitespace-nowrap">수정</span>
                    </button>

                    <button type="button" className="py-2 px-4 hover:bg-slate-50">
                      <span className="text-slate-900 text-sm whitespace-nowrap" onClick={commentDelete}>
                        삭제
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </a>
          </div>

          {isEditing ? (
            <div className="mb-4 pr-5 pl-11">
              <div className="w-full">
                <textarea
                  className="flex-1 rounded border border-slate-300 w-full h-32 px-3 py-2 text-sm placeholder-slate-400 focus:outline-none resize-none"
                  value={modifyContent}
                  onChange={handleContentChange}
                />
                <div className="mt-2 flex gap-2 justify-end">
                  <button className="py-1.5 px-3 rounded border text-black text-xs" onClick={() => setIsEditing(false)}>
                    취소
                  </button>
                  <button
                    className="py-1.5 px-3 rounded text-white text-xs focus:outline-none bg-black"
                    onClick={modifySave}
                  >
                    완료
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4 pl-11">
              <p className="w-full rounded bg-slate-50 px-3 py-2 text-sm text-slate-900 overflow-anywhere whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          )}
        </div>
      </li>
    </>
  );
}
