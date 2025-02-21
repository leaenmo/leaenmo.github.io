const Footer = () => {
  return (
    <footer className="bg-[#f8f4f0] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-[#8b7355]">
          <p>© 2024 你的名字. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="https://github.com/你的用户名" className="hover:text-[#6b563c]">
              GitHub
            </a>
            <a href="https://linkedin.com/in/你的用户名" className="hover:text-[#6b563c]">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 