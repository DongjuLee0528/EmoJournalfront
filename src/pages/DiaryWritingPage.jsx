import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api/axiosInstance';

// --- DiaryListPage와 동일한 로그인 안내창 스타일 ---
const ListWrapper = styled.div`
  width: 100%;
  max-width: 64rem;
  padding: 0 2rem; 
  box-sizing: border-box; 
`;

const ListContent = styled.div`
  background: rgb(255, 255, 255);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const LoginPromptContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
`;

const LoginPromptTitle = styled.h2`
  font-size: 36px;
  color: #374151;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.4;
`;

const LoginPromptText = styled.p`
  font-size: 20px;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const LoginButton = styled.button`
  background-color: #ec4899;
  color: white;
  font-size: 18px;
  font-weight: 600;
  padding: 0.8rem 2.5rem;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background-color: #d94682;
  }

  &:active {
    transform: translateY(0);
  }
`;

const Container = styled.div`
  font-family: '온글잎 의연체', sans-serif;
  width: 100%; 
  margin: 0 auto;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: calc(65px + 2rem);
  padding-bottom: calc(25px + 2rem);
`;

// --- 이하 기존 스타일 컴포넌트는 변경사항 없음 ---
const UploadBox = styled.label`
  width: 100%;
  border-radius: 12px;
  background-color: ${({ showText, hasImage }) =>
    showText ? '#322832' : hasImage ? '#322832' : '#ffffff'};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: ${({ showText }) => (showText ? 'flex-start' : 'center')};
  justify-content: ${({ showText }) => (showText ? 'flex-start' : 'center')};
  text-align: ${({ showText }) => (showText ? 'left' : 'center')};
  min-height: 400px;
  height: 400px;
  box-sizing: border-box;
  padding: 20px;
  overflow: hidden;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  transition: all 0.2s ease;

  &:hover {
    transform: ${({ disabled }) => (disabled ? 'none' : 'translateY(-2px)')};
  }
`;

const UploadInput = styled.input`
  display: none;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const UploadText = styled.div`
  font-size: 30px;
  color: #333;
  user-select: none;
`;

const DiaryMessageBox = styled.div`
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  border-radius: 12px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 16px 20px;
  gap: 8px;
  text-align: center;
  min-height: 80px;
  box-sizing: border-box;
`;

const DiaryBox = styled.div`
  width: 100%;
  height: 390px;
  background-color: white;
  border-radius: 17px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: relative;
  box-sizing: border-box;
`;

const DiaryTextarea = styled.textarea`
  width: 100%;
  height: calc(100% - 60px);
  border: none;
  resize: none;
  background: transparent;
  font-size: 30px;
  padding: 0px 20px 20px 20px;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1.4;

  &::placeholder {
    color: #ccc;
  }

  &:read-only {
    background-color: #f9f9f9;
    cursor: default;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  align-self: flex-end;
  width: 100%;
  justify-content: flex-end;
`;

const Button = styled.button`
  width: 120px;
  height: 36px;
  background-color: white;
  border: none;
  border-radius: 12px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0px);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
  }
`;

const ButtonText = styled.span`
  font-size: 30px;
  color: #333;
  user-select: none;
`;

const WordCount = styled.div`
  align-self: flex-end;
  font-size: 30px;
  color: #848383ff;
  user-select: none;
  margin-top: -20px; 
  width: 100%;
  text-align: right;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  border-radius: 12px;
  cursor: default;
`;

const EmotionAnalyze = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  font-size: 30px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  padding: 0 0 0 20px;
`;

const EmotionAnalyzeText = styled.p`
  margin: 20px 0 0 0;
  padding: 0;
  font-size: 20px;
  line-height: 1.4;
  white-space: pre-line;
  color: #333;
`;

const DateBox = styled.div`
  font-size: 35px;
  font-weight: bold;
  margin: 20px 0px 0px 20px;
  color: #333;
  user-select: none;
`;

const EmojiImage = styled.img`
  max-height: 60px;
  cursor: pointer;
  transition: transform 0.2s ease;
  user-select: none;

  &:hover {
    transform: scale(1.1);
  }
`;

const HashtagText = styled.div`
  color: #666;
  font-weight: 500;
  user-select: none;
`;

const LoadingText = styled.div`
  color: #666;
  line-height: 1.5;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;

const DiaryWritingPage = () => {
  const navigate = useNavigate();
  const [diaryText, setDiaryText] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hashtag, setHashtag] = useState(null);
  const [emojiUrl, setEmojiUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [emotionAnalyzeText, setEmotionAnalyzeText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 인증 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  // 메모리 누수 방지를 위한 cleanup
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleLoginClick = () => {
    navigate('/LoginPageOauth');
  };

  const openFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('파일 크기는 5MB 이하로 선택해주세요.');
          return;
        }

        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }

        const url = URL.createObjectURL(file);
        setImageUrl(url);
        setImageFile(file);
        setShowInterpretation(false);
      }
    };
    input.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하로 선택해주세요.');
        return;
      }

      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }

      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImageFile(file);
      setShowInterpretation(false);
      e.target.value = '';
    }
  };

  const handleImageClick = () => {
    if (imageUrl) setIsModalOpen(true);
  };

  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const handleEmojiClick = () => {
    setShowInterpretation((prev) => !prev);
  };

  const handleSave = async () => {
    if (!diaryText.trim()) {
      alert('일기를 입력해주세요!');
      return;
    }

    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('content', diaryText);
      formData.append('isPublic', 'false');

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.post('/api/diary', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = response.data;

      setIsSaved(true);
      setHashtag(data?.emotionKeyword ? `#${data.emotionKeyword}` : '');
      setEmojiUrl(data?.emotionImageUrl ?? null);
      setEmotionAnalyzeText(data?.content || '');

      alert('일기가 저장되었습니다!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || '일기 저장에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsSaved(false);
    setShowInterpretation(false);
  };

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }

      setDiaryText('');
      setImageUrl(null);
      setImageFile(null);
      setIsSaved(false);
      setShowInterpretation(false);
      setHashtag(null);
      setEmojiUrl(null);
      setEmotionAnalyzeText('');
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    return `${year}.${month}.${date}`;
  };

  return (
    <>
      <Header />
      {/* [수정] centered prop을 제거하여 항상 상단에 정렬되도록 함 */}
      <Container>
        {!isAuthenticated ? (
          <ListWrapper>
            <ListContent>
              <LoginPromptContainer>
                <LoginPromptTitle>
                  나만의 감정 일기를 쓰고 싶다면<br />
                  로그인 후 이용해주세요
                </LoginPromptTitle>
                <LoginPromptText>
                  사진과 글로 오늘의 감정을 기록하고<br />
                  AI의 감정 분석도 받아보세요.
                </LoginPromptText>
                {/* [수정] 버튼 텍스트 변경 */}
                <LoginButton onClick={handleLoginClick}>
                  지금 시작하기
                </LoginButton>
              </LoginPromptContainer>
            </ListContent>
          </ListWrapper>
        ) : (
          <ListWrapper>
            <ListContent>
              <DiaryMessageBox>
                {isSaved ? (
                  <>
                    {emojiUrl && (
                      <EmojiImage
                        src={emojiUrl}
                        alt="emotion emoji"
                        onClick={handleEmojiClick}
                      />
                    )}
                    <HashtagText>{hashtag || ''}</HashtagText>
                  </>
                ) : (
                  <LoadingText>
                    AI가 열심히 작성 중이에요... 조금만 기다려주실래요? 곧 예쁜 결과물로 돌아올게요!
                  </LoadingText>
                )}
              </DiaryMessageBox>

              <UploadBox
                hasImage={!!imageUrl}
                showText={!!showInterpretation}
                disabled={isSaved}
                onClick={!isSaved && !showInterpretation && !imageUrl ? openFilePicker : undefined}
              >
                <UploadInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSaved}
                />
                {showInterpretation ? (
                  <EmotionAnalyze>
                    <EmotionAnalyzeText>
                      💬 감정 해석<br/>{emotionAnalyzeText}
                    </EmotionAnalyzeText>
                  </EmotionAnalyze>
                ) : imageUrl ? (
                  <PreviewImage src={imageUrl} alt="preview" onClick={!isSaved ? () => { handleImageClick(); openFilePicker(); } : handleImageClick} />
                ) : (
                  <UploadText>사진을 업로드하려면 클릭하세요</UploadText>
                )}
              </UploadBox>

              <DiaryBox>
                <DateBox>{getTodayDate()}</DateBox>
                <DiaryTextarea
                  value={diaryText}
                  onChange={(e) => setDiaryText(e.target.value)}
                  placeholder="여기에 오늘의 일기를 입력하세요..."
                  readOnly={isSaved}
                />
              </DiaryBox>
              
              <WordCount>{diaryText.length}자</WordCount>
              
              <ButtonGroup>
                {!isSaved ? (
                  <Button onClick={handleSave}>
                    <ButtonText>저장</ButtonText>
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleEdit}>
                      <ButtonText>수정</ButtonText>
                    </Button>
                    <Button onClick={handleDelete}>
                      <ButtonText>삭제</ButtonText>
                    </Button>
                  </>
                )}
              </ButtonGroup>

              {isModalOpen && (
                <ModalOverlay onClick={closeModal}>
                  <ModalImage src={imageUrl} alt="Full Preview" />
                </ModalOverlay>
              )}
            </ListContent>
          </ListWrapper>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default DiaryWritingPage;
