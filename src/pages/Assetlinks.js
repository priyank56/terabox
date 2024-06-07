import React, { useEffect } from "react";

function Assetlinks() {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://1024tera.com/.well-known/assetlinks.json"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <pre>
        {JSON.stringify([
          {
            relation: ["delegate_permission/common.handle_all_urls"],
            target: {
              namespace: "android_app",
              package_name: "com.grapes.gallery",
              sha256_cert_fingerprints: [
                "E7:C4:9C:26:96:12:BE:55:C7:C5:AE:2E:DF:BF:F4:34:90:00:83:B9:2E:B0:66:61:A1:60:04:15:5C:A5:D4:3A",
              ],
            },
          },
        ])}
      </pre>
    </div>
  );
}

export default Assetlinks;
