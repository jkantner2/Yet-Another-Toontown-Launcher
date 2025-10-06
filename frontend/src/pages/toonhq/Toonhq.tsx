import React from "react";

const ToonHQPage: React.FC = () => {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center bg-gray-100">
        <div className="w-[800px] h-[600px] rounded-lg overflow-hidden shadow-lg border">
          <iframe
            src="https://toonhq.org"
            title="ToonHQ"
            className="w-full h-full"
            sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
          />
        </div>
      </div>
    </>
  );
};

export default ToonHQPage;
