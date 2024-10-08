document.addEventListener('DOMContentLoaded', function() {
    const footerHTML = `
      <footer class="footer">
        <div class="footer-content">
          <p>&copy; 2024 고양이 마트</p>
          <p> all right reserved</p>
          <p class="footer-gray">개인정보 처리방침</p>
          <p class="footer-gray">이용약관</p>
          </ul>
        </div>
      </footer>
    `;
  
    // 페이지의 끝에 footer를 삽입합니다.
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  });
  