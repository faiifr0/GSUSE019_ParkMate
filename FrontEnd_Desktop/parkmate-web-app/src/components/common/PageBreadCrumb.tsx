import Link from "next/link";
import React from "react";

interface BreadcrumbProps {
  pageTitle: string;
  items?: { name: string; path?: string }[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, items }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      {/* <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        {pageTitle}
      </h2> */}
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              href="/"
            >
              Dashboard
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>

          {items?.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5 text-sm">              
              {item.path ? (
                <Link
                  href={item.path}
                  className="text-gray-500 dark:text-gray-400 hover:underline"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-gray-800 dark:text-white/90">
                  {item.name}
                </span>
              )}

              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </li>
          ))}

          <li className="text-sm text-gray-800 dark:text-white/90">
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
