import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">

        <div className="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4">
                {/* <img
                  width={231}
                  height={48}
                  src="./images/logo/auth-logo.svg"
                  alt="Logo"
                /> */}
                <span className="text-white dark:text-white/90 font-bold text-3xl select-none">
                  Skills Yatra
                </span>
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">
                Welcome to Skills Yatra, where we help you build essential skills across diverse domains to support your professional growth.
              </p>
            </div>
          </div>
        </div>
        {children}
        {/* <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div> */}
      </div>
    </div>
  );
}
