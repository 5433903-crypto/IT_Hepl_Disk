const mongoose = require('mongoose');
const User = require('../models/User');
const Outage = require('../models/Outage');
const Ticket = require('../models/Ticket');
const Lab = require('../models/Lab');
const KnowledgeBase = require('../models/KnowledgeBase');

const seedData = async () => {
  console.log('[Seed] Beginning database initialization...');

  // Clear existing collections
  await User.deleteMany({});
  await Outage.deleteMany({});
  await Ticket.deleteMany({});
  await Lab.deleteMany({});
  await KnowledgeBase.deleteMany({});

  // 1. Create Default Users
  const users = await User.create([
    {
      name: 'Prof. Rajesh Sharma (Head IT Admin)',
      email: 'admin@campus.edu',
      password: 'Admin@123',
      rollNo: 'ADMIN-01',
      role: 'admin',
      department: 'IT Operations & Infrastructure',
    },
    {
      name: 'Suresh Patil (Hardware & Net Tech)',
      email: 'tech@campus.edu',
      password: 'Tech@123',
      rollNo: 'TECH-02',
      role: 'technician',
      department: 'Campus IT Operations',
    },
    {
      name: 'Aarav Mehta',
      email: 'cs2022042@campus.edu',
      password: 'Student@123',
      rollNo: 'CS-2022-042',
      role: 'student',
      department: 'Computer Engineering',
      assignedLab: 'Lab 2',
      assignedPc: 'PC-14',
    },
    {
      name: 'Priya Nair',
      email: 'cs2022018@campus.edu',
      password: 'Student@123',
      rollNo: 'CS-2022-018',
      role: 'student',
      department: 'Computer Engineering',
      assignedLab: 'Lab 1',
      assignedPc: 'PC-07',
    },
  ]);

  // 2. Create Computer Engineering Labs
  const labs = await Lab.create([
    {
      labNumber: 'Lab 1',
      labName: 'Advanced Networking & Cyber Defense Lab',
      building: 'Turing Block, 3rd Floor',
      status: 'Online',
      totalPCs: 40,
      activePCs: 39,
      primarySwitch: 'Cisco Catalyst 3850 (48-Port PoE+)',
      subnet: '192.168.10.0/24',
      defaultGateway: '192.168.10.1',
      currentNotice: 'All systems operating at full capacity.',
      lastMaintained: new Date(),
    },
    {
      labNumber: 'Lab 2',
      labName: 'AI, GPU & High-Performance Computing Lab',
      building: 'Turing Block, 3rd Floor',
      status: 'Degraded',
      totalPCs: 35,
      activePCs: 30,
      primarySwitch: 'Aruba 2930F-48G L3 Switch',
      subnet: '192.168.20.0/24',
      defaultGateway: '192.168.20.1',
      currentNotice: 'Switch uplink firmware upgrade in progress. Intermittent latency.',
      lastMaintained: new Date(),
    },
    {
      labNumber: 'Lab 3',
      labName: 'Cloud Computing & Distributed Systems Lab',
      building: 'Babbage Hall, 2nd Floor',
      status: 'Online',
      totalPCs: 40,
      activePCs: 40,
      primarySwitch: 'Juniper EX3300 Gigabit Switch',
      subnet: '192.168.30.0/24',
      defaultGateway: '192.168.30.1',
      currentNotice: 'Nominal operational status.',
      lastMaintained: new Date(),
    },
    {
      labNumber: 'Lab 4',
      labName: 'Operating Systems & Systems Architecture Lab',
      building: 'Babbage Hall, 2nd Floor',
      status: 'Online',
      totalPCs: 45,
      activePCs: 43,
      primarySwitch: 'Cisco Catalyst 2960-X',
      subnet: '192.168.40.0/24',
      defaultGateway: '192.168.40.1',
      currentNotice: 'Nominal operational status.',
      lastMaintained: new Date(),
    },
    {
      labNumber: 'Lab 5',
      labName: 'Software Engineering & Full Stack Web Lab',
      building: 'Lovelace Tower, 4th Floor',
      status: 'Online',
      totalPCs: 40,
      activePCs: 40,
      primarySwitch: 'HP ProCurve 2530-48G',
      subnet: '192.168.50.0/24',
      defaultGateway: '192.168.50.1',
      currentNotice: 'Nominal operational status.',
      lastMaintained: new Date(),
    },
    {
      labNumber: 'Lab 6',
      labName: 'IoT, Robotics & Embedded Systems Lab',
      building: 'Lovelace Tower, 4th Floor',
      status: 'Online',
      totalPCs: 30,
      activePCs: 28,
      primarySwitch: 'Cisco SG350-28 Managed Switch',
      subnet: '192.168.60.0/24',
      defaultGateway: '192.168.60.1',
      currentNotice: 'All microcontroller testbenches ready.',
      lastMaintained: new Date(),
    },
  ]);

  // 3. Create Pre-indexed KnowledgeBase articles
  const kbArticles = await KnowledgeBase.create([
    {
      kbId: 'KB-NET-101',
      errorCode: 'DNS_PROBE_FINISHED_NXDOMAIN',
      title: 'Campus Intranet / DNS Server Resolution Failure',
      category: 'Network',
      symptoms: ['Browser shows server IP address could not be found', 'Pinging domain fails but pinging 8.8.8.8 works'],
      detectionKeywords: ['dns', 'nxdomain', 'probe', 'name resolution', 'domain', 'cannot reach site'],
      resolutionSteps: [
        'Open Command Prompt as Administrator.',
        'Flush local DNS client cache: execute "ipconfig /flushdns".',
        'Verify IPv4 DNS servers are pointing to Campus Primary DNS (192.168.1.10) or Google DNS (8.8.8.8).',
        'Release and renew DHCP IP configuration: execute "ipconfig /renew".',
        'Restart the DNS Client Windows Service if error persists: execute "net stop dnscache && net start dnscache".',
      ],
      suggestedCommands: ['ipconfig /flushdns', 'ipconfig /renew', 'ping 192.168.1.10', 'nslookup google.com'],
      escalateIf: 'If the primary campus DNS server (192.168.1.10) does not reply to ICMP ping.',
      successRate: 94,
    },
    {
      kbId: 'KB-NET-102',
      errorCode: 'ERR_INTERNET_DISCONNECTED',
      title: 'Physical Ethernet Link Down / NIC Interface Disabled',
      category: 'Network',
      symptoms: ['Yellow exclamation mark or red cross on system tray network icon', 'No default gateway'],
      detectionKeywords: ['disconnected', 'unplugged', 'no internet', 'cable', 'ethernet', 'nic down'],
      resolutionSteps: [
        'Inspect physical CAT-6 cable latch at the back of the desktop CPU tower.',
        'Ensure the green/amber Link LED on the RJ-45 Ethernet port is blinking.',
        'Restart the Ethernet network adapter via command prompt or network control panel.',
        'Reset TCP/IP network stack: execute "netsh int ip reset".',
        'Reset Winsock catalog: execute "netsh winsock reset", then reboot PC.',
      ],
      suggestedCommands: ['netsh interface show interface', 'netsh winsock reset', 'ipconfig /all'],
      escalateIf: 'If Link LED on Ethernet port does not illuminate after replugging cable.',
      successRate: 88,
    },
    {
      kbId: 'KB-NET-103',
      errorCode: 'DHCP_LEASE_TIMEOUT',
      title: 'Automatic IP Configuration Failure (APIPA 169.254.x.x Assigned)',
      category: 'Network',
      symptoms: ['IP address starts with 169.254', 'Cannot reach local subnet gateway'],
      detectionKeywords: ['dhcp', 'lease', 'apipa', '169.254', 'unidentified network'],
      resolutionSteps: [
        'Release current invalid address: execute "ipconfig /release".',
        'Re-query lab DHCP scope: execute "ipconfig /renew".',
        'Check if switch port port-security has triggered on the lab switch rack.',
      ],
      suggestedCommands: ['ipconfig /release', 'ipconfig /renew', 'arp -a'],
      escalateIf: 'DHCP renew command returns "unable to contact your DHCP server".',
      successRate: 91,
    },
    {
      kbId: 'KB-GPU-201',
      errorCode: 'CUDA_DEVICE_INITIALIZATION_FAILED',
      title: 'NVIDIA CUDA Kernel & Driver Driver Mismatch Error',
      category: 'OS / Driver',
      symptoms: ['PyTorch or TensorFlow reports "No CUDA GPUs are available"', 'nvidia-smi error: Driver/library version mismatch'],
      detectionKeywords: ['cuda', 'nvidia', 'gpu', 'driver', 'tensor', 'pytorch', 'kernel'],
      resolutionSteps: [
        'Open terminal and execute "nvidia-smi" to confirm GPU hardware visibility.',
        'If driver mismatch is shown, purge conflicting kernel modules or restart the display driver: press Win + Ctrl + Shift + B.',
        'Verify PyTorch CUDA toolkit matches installed driver with: python -c "import torch; print(torch.cuda.is_available())".',
        'Request lab technician to execute GPU driver re-installation package.',
      ],
      suggestedCommands: ['nvidia-smi', 'python -c "import torch; print(torch.cuda.is_available())"'],
      escalateIf: 'nvidia-smi returns "NVIDIA-SMI has failed because it couldn\'t communicate with the NVIDIA driver".',
      successRate: 85,
    },
    {
      kbId: 'KB-SYS-301',
      errorCode: 'BSOD_SYSTEM_SERVICE_EXCEPTION',
      title: 'Windows Kernel Crash / Blue Screen of Death (BSOD)',
      category: 'Hardware',
      symptoms: ['Blue screen stop error', 'PC spontaneously restarts during heavy compute'],
      detectionKeywords: ['bsod', 'blue screen', 'stop code', 'crash', 'system service exception', 'dump'],
      resolutionSteps: [
        'Note down the exact stop code or faulty sys driver (e.g. ntoskrnl.exe, nvlddmkm.sys).',
        'Boot into Safe Mode with Networking by holding Shift while selecting Restart.',
        'Run Windows System File Checker: execute "sfc /scannow".',
        'Check memory integrity using Windows Memory Diagnostic tool.',
      ],
      suggestedCommands: ['sfc /scannow', 'dism /online /cleanup-image /restorehealth'],
      escalateIf: 'BSOD loops repeatedly upon standard boot.',
      successRate: 78,
    },
    {
      kbId: 'KB-SEC-401',
      errorCode: 'ERR_CERT_AUTHORITY_INVALID',
      title: 'Campus Proxy SSL Inspection Certificate Untrusted',
      category: 'Software',
      symptoms: ['HTTPS websites show "Your connection is not private"', 'Git clone over HTTPS fails with SSL certificate problem'],
      detectionKeywords: ['certificate', 'ssl', 'untrusted', 'authority', 'proxy', 'https', 'x509'],
      resolutionSteps: [
        'Verify system date and time are accurately synchronized with campus NTP server (pool.ntp.org).',
        'Install Campus CA Root Certificate into Windows "Trusted Root Certification Authorities" store.',
        'For Git clients, configure SSL verification or import bundle: git config --global http.sslVerify true.',
      ],
      suggestedCommands: ['w32tm /resync', 'git config --global http.sslBackend schannel'],
      escalateIf: 'Campus Root CA cert file is missing from local computer cert store.',
      successRate: 95,
    },
  ]);

  // 4. Create Outages
  const estimatedFutureTime = new Date(Date.now() + 90 * 60 * 1000); // 1.5 hours in future
  const outages = await Outage.create([
    {
      outageId: 'OUT-2026-001',
      affectedLocation: 'Lab 2',
      title: 'Lab 2 Core Switch Firmware Upgrade & VLAN 20 Reconfiguration',
      description: 'Scheduled Aruba switch firmware upgrade and VLAN 20 reconfiguration. Network packets in Lab 2 may experience intermittent packet loss and dropouts.',
      severity: 'Major',
      status: 'In Progress',
      impactedServices: ['Intranet VLAN 20', 'GPU Cluster NFS Mount', 'Internet Gateway'],
      startTime: new Date(Date.now() - 45 * 60 * 1000), // Started 45m ago
      estimatedEndTime: estimatedFutureTime,
      createdByName: 'Prof. Rajesh Sharma (Head IT Admin)',
    },
    {
      outageId: 'OUT-2026-002',
      affectedLocation: 'Campus-Wide',
      title: 'Central ISP Gateway BGP Link Flapping Resolution',
      description: 'Primary National Knowledge Network (NKN) fiber link flap. Failover to backup Tata Communications lease completed.',
      severity: 'Critical',
      status: 'Resolved',
      impactedServices: ['Campus External Internet', 'VPN Gateway'],
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      estimatedEndTime: new Date(Date.now() - 22 * 60 * 60 * 1000),
      resolvedAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
      createdByName: 'Prof. Rajesh Sharma (Head IT Admin)',
      resolutionNotes: 'BGP peering re-established with ISP NOC team.',
    },
  ]);

  // 5. Create Sample Tickets
  const tickets = await Ticket.create([
    {
      ticketNumber: 'TICK-2026-0101',
      studentId: users[2]._id, // Aarav Mehta
      studentName: 'Aarav Mehta',
      studentRollNo: 'CS-2022-042',
      department: 'Computer Engineering',
      labNumber: 'Lab 2',
      pcNumber: 'PC-14',
      title: 'Cannot resolve internal lab server address',
      description: 'Browser shows DNS_PROBE_FINISHED_NXDOMAIN when trying to open internal course portal.',
      category: 'Network',
      severity: 'High',
      imageUrl: '',
      aiResult: {
        errorCode: 'DNS_PROBE_FINISHED_NXDOMAIN',
        matchedKbTitle: 'Campus Intranet / DNS Server Resolution Failure',
        kbId: 'KB-NET-101',
        confidence: 94,
        provider: 'Knowledge Base Diagnostic Engine (Local Fallback)',
        recommendedFix: [
          'Flush local DNS client cache: ipconfig /flushdns',
          'Point DNS to campus resolver 192.168.1.10',
          'Renew DHCP lease: ipconfig /renew',
        ],
        analyzedAt: new Date(Date.now() - 30 * 60 * 1000),
      },
      status: 'In Progress',
      assignedTo: 'Suresh Patil (Hardware & Net Tech)',
      technicianNotes: 'Investigating whether switch firmware reload in Lab 2 dropped DNS route.',
      createdAt: new Date(Date.now() - 35 * 60 * 1000),
    },
    {
      ticketNumber: 'TICK-2026-0102',
      studentId: users[3]._id, // Priya Nair
      studentName: 'Priya Nair',
      studentRollNo: 'CS-2022-018',
      department: 'Computer Engineering',
      labNumber: 'Lab 1',
      pcNumber: 'PC-07',
      title: 'NVIDIA CUDA driver missing on deep learning workstation',
      description: 'Model training script fails with CUDA device initialization error.',
      category: 'OS / Driver',
      severity: 'Medium',
      aiResult: {
        errorCode: 'CUDA_DEVICE_INITIALIZATION_FAILED',
        matchedKbTitle: 'NVIDIA CUDA Kernel & Driver Driver Mismatch Error',
        kbId: 'KB-GPU-201',
        confidence: 89,
        provider: 'Knowledge Base Diagnostic Engine (Local Fallback)',
        recommendedFix: ['Run nvidia-smi', 'Restart display driver stack: Win + Ctrl + Shift + B'],
        analyzedAt: new Date(Date.now() - 120 * 60 * 1000),
      },
      status: 'Open',
      assignedTo: 'Unassigned',
      createdAt: new Date(Date.now() - 120 * 60 * 1000),
    },
    {
      ticketNumber: 'TICK-2026-0103',
      studentName: 'Rohan Gupta',
      studentRollNo: 'CS-2022-031',
      department: 'Computer Engineering',
      labNumber: 'Lab 3',
      pcNumber: 'PC-22',
      title: 'Physical RJ-45 clip broken, network keeps dropping',
      description: 'The Ethernet wire clip is snapped so wire gets loose easily.',
      category: 'Hardware',
      severity: 'Low',
      status: 'Resolved',
      assignedTo: 'Suresh Patil (Hardware & Net Tech)',
      technicianNotes: 'Re-crimped RJ-45 connector and tested link with Fluke network tester. Link solid at 1Gbps.',
      resolvedAt: new Date(Date.now() - 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 180 * 60 * 1000),
    },
    {
      ticketNumber: 'TICK-2026-0104',
      studentName: 'Kavita Joshi',
      studentRollNo: 'CS-2022-055',
      department: 'Computer Engineering',
      labNumber: 'Lab 4',
      pcNumber: 'PC-03',
      title: 'Linux kernel panic during QEMU hypervisor lab',
      description: 'Workstation rebooted unexpectedly during systems virtualization lab.',
      category: 'Software',
      severity: 'Medium',
      status: 'Resolved',
      assignedTo: 'Prof. Rajesh Sharma (Head IT Admin)',
      technicianNotes: 'Updated KVM CPU flags in BIOS to support VT-x nested virtualization.',
      resolvedAt: new Date(Date.now() - 90 * 60 * 1000),
      createdAt: new Date(Date.now() - 240 * 60 * 1000),
    },
  ]);

  console.log('[Seed] Database initialization complete!');
  return {
    usersCount: users.length,
    labsCount: labs.length,
    kbArticlesCount: kbArticles.length,
    outagesCount: outages.length,
    ticketsCount: tickets.length,
  };
};

// Allow direct execution: node src/seeds/seedData.js
if (require.main === module) {
  require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
  const connectDB = require('../config/db');

  connectDB()
    .then(async () => {
      await seedData();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Error]', err);
      process.exit(1);
    });
}

module.exports = { seedData };
