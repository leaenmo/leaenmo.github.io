import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-[url('./images/zatu/悟空.jpg')] bg-cover bg-center shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-[#8b7355] text-xl font-semibold">
              你的名字
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[#8b7355] hover:text-[#6b563c]">
              首页
            </Link>
            <Link to="/resume" className="text-[#8b7355] hover:text-[#6b563c]">
              简历
            </Link>
            <Link to="/projects" className="text-[#8b7355] hover:text-[#6b563c]">
              项目
            </Link>
          </div>
          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center">
            <button className="text-[#8b7355]">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 