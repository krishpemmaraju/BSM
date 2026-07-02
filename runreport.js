const { execSync } = require("child_process");
 
async function run() {
  try {
    console.log("🧹 Cleaning reports...");
    execSync("npm run clean:reports", { stdio: "inherit" });
 
    console.log("🚀 Running tests...");
    execSync("npm run execute:script:tst", { stdio: "inherit" });
 
  } catch (err) {
    console.error("❌ Tests failed");
  } finally {
    console.log("📊 Generating report...");
    execSync("npm run generate:report", { stdio: "inherit" });
 
    console.log("✅ Report generated");
  }
}
 
run();