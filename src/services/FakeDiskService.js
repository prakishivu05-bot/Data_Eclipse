const DISK_KEY = "FAKE_DISK_STATE";

const DEFAULT_FILES = [
  { name: 'confidential_report.pdf', content: 'CONFIDENTIAL: Q3 Financial earnings show a massive 200% increase. DO NOT LEAK.', type: 'pdf' },
  { name: 'passwords.txt', content: 'admin:supersecret123\nroot:godmode99\ndb:dbpass456', type: 'txt' },
  { name: 'client_data.json', content: '{"clients": [{"name": "John Doe", "ssn": "000-11-2222", "card": "4111-1111-1111-1111"}]}', type: 'json' },
  { name: 'system_logs.log', content: '[ERROR] Failed login attempt from 192.168.1.55\n[INFO] Backup completed successfully.', type: 'log' },
  { name: 'backup.zip', content: 'PK\\x03\\x04\\x14\\x00\\x00\\x00\\x08\\x00\\x08\\x03...\\x00\\x00(zipped data)', type: 'zip' }
];

export const getDisk = () => {
  const stored = localStorage.getItem(DISK_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  const newDisk = {
    id: 'dev-sdb',
    name: '/dev/sdb',
    size: '100.00 MB',
    type: 'NVMe PCI-E',
    image: 'demo_disk.img',
    wiped: false,
    files: [...DEFAULT_FILES]
  };
  
  saveDisk(newDisk);
  console.log("[INIT] Fresh disk created");
  sessionStorage.setItem("JUST_RESET", "true");
  return newDisk;
};

export const saveDisk = (diskState) => {
  localStorage.setItem(DISK_KEY, JSON.stringify(diskState));
};

export const resetDisk = () => {
  try {
    localStorage.removeItem(DISK_KEY);
    console.log("[RESET] Disk state cleared");
    return true;
  } catch (e) {
    console.error("[RESET] Failed:", e);
    return false;
  }
};

export const wipeDisk = async (onProgress) => {
  const disk = getDisk();
  if (disk.wiped) return disk;

  // Simulate 3 passes
  const passes = 3;
  for (let pass = 1; pass <= passes; pass++) {
    // Modify contents with random data
    disk.files = disk.files.map(file => ({
      ...file,
      content: Array.from(crypto.getRandomValues(new Uint8Array(64))).map(b => b.toString(16).padStart(2, '0')).join('')
    }));
    
    // Smooth progress simulation
    for (let p = 0; p <= 100; p += (Math.random() * 10 + 5)) {
      const progress = Math.min(Math.floor(p), 100);
      if (onProgress) onProgress(pass, passes, progress);
      await new Promise(r => setTimeout(r, 200)); 
    }
    // ensure it hits 100
    if (onProgress) onProgress(pass, passes, 100);
  }
  
  disk.wiped = true;
  saveDisk(disk);
  return disk;
};

export const generateHash = async (diskObject) => {
  const dataString = JSON.stringify(diskObject.files);
  const msgBuffer = new TextEncoder().encode(dataString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const isAlreadyWiped = () => {
  return getDisk().wiped;
};
