// Tab switching logic for Resume Section

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      let target = tab.getAttribute('data-tab');

      // Remove active from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      // Add active to clicked tab and respective content
      tab.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });
});
