import { Test } from '../types';

export const seedTests: Test[] = [
  {
    id: 'test-cs-ch1',
    title: 'Computer Science — Chapter 1',
    slug: 'computer-science-chapter-1',
    description: 'Fundamentals of computer systems, hardware, software, and basic computing concepts.',
    category: 'Computer Science',
    difficulty: 'Beginner',
    questions: [
      {
        id: 'q1-1',
        testId: 'test-cs-ch1',
        text: 'What is the primary function of the CPU in a computer system?',
        options: [
          'Store data permanently',
          'Process instructions and perform calculations',
          'Display graphics on the screen',
          'Connect to the internet'
        ],
        correctAnswer: 1,
        explanation: 'The CPU (Central Processing Unit) is the brain of the computer that processes instructions and performs arithmetic and logical calculations.'
      },
      {
        id: 'q1-2',
        testId: 'test-cs-ch1',
        text: 'Which of the following is an example of system software?',
        options: [
          'Microsoft Word',
          'Google Chrome',
          'Windows Operating System',
          'Adobe Photoshop'
        ],
        correctAnswer: 2,
        explanation: 'An operating system like Windows is system software that manages hardware and provides a platform for application software.'
      },
      {
        id: 'q1-3',
        testId: 'test-cs-ch1',
        text: 'What does RAM stand for?',
        options: [
          'Read Access Memory',
          'Random Access Memory',
          'Run Application Memory',
          'Rapid Access Module'
        ],
        correctAnswer: 1,
        explanation: 'RAM stands for Random Access Memory. It is volatile memory used for temporary data storage while the computer is running.'
      },
      {
        id: 'q1-4',
        testId: 'test-cs-ch1',
        text: 'Which of the following is NOT an input device?',
        options: [
          'Keyboard',
          'Mouse',
          'Monitor',
          'Microphone'
        ],
        correctAnswer: 2,
        explanation: 'A monitor is an output device that displays information. Keyboards, mice, and microphones are all input devices.'
      },
      {
        id: 'q1-5',
        testId: 'test-cs-ch1',
        text: 'What is the binary representation of the decimal number 10?',
        options: [
          '1010',
          '1100',
          '1001',
          '1110'
        ],
        correctAnswer: 0,
        explanation: '10 in decimal = 8 + 2 = 2³ + 2¹ = 1010 in binary.'
      },
      {
        id: 'q1-6',
        testId: 'test-cs-ch1',
        text: 'Which data structure uses FIFO (First In, First Out) principle?',
        options: [
          'Stack',
          'Queue',
          'Tree',
          'Graph'
        ],
        correctAnswer: 1,
        explanation: 'A Queue follows the FIFO principle where the first element added is the first one to be removed.'
      },
      {
        id: 'q1-7',
        testId: 'test-cs-ch1',
        text: 'What is the purpose of an algorithm?',
        options: [
          'To store data in a database',
          'To provide a step-by-step procedure for solving a problem',
          'To compile source code into machine code',
          'To design user interfaces'
        ],
        correctAnswer: 1,
        explanation: 'An algorithm is a finite set of well-defined instructions or steps used to solve a specific problem or perform a computation.'
      },
      {
        id: 'q1-8',
        testId: 'test-cs-ch1',
        text: 'Which of the following is a high-level programming language?',
        options: [
          'Machine Language',
          'Assembly Language',
          'Python',
          'Binary Code'
        ],
        correctAnswer: 2,
        explanation: 'Python is a high-level programming language that is easy to read and write. Machine language and binary code are low-level, while assembly is a low-level symbolic language.'
      },
      {
        id: 'q1-9',
        testId: 'test-cs-ch1',
        text: 'What does HTTP stand for?',
        options: [
          'HyperText Transfer Protocol',
          'High Tech Transfer Program',
          'HyperText Transmission Process',
          'Home Tool Transfer Protocol'
        ],
        correctAnswer: 0,
        explanation: 'HTTP stands for HyperText Transfer Protocol. It is the foundation of data communication on the World Wide Web.'
      },
      {
        id: 'q1-10',
        testId: 'test-cs-ch1',
        text: 'Which of the following is used to uniquely identify a device on a network?',
        options: [
          'URL',
          'IP Address',
          'HTML',
          'DNS'
        ],
        correctAnswer: 1,
        explanation: 'An IP (Internet Protocol) Address uniquely identifies each device on a network, allowing them to communicate with each other.'
      }
    ]
  },
  {
    id: 'test-cs-ch2',
    title: 'Computer Science — Chapter 2',
    slug: 'computer-science-chapter-2',
    description: 'Data structures, algorithms complexity, and problem-solving techniques.',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'q2-1',
        testId: 'test-cs-ch2',
        text: 'What is the time complexity of binary search?',
        options: [
          'O(n)',
          'O(n²)',
          'O(log n)',
          'O(1)'
        ],
        correctAnswer: 2,
        explanation: 'Binary search has O(log n) time complexity because it halves the search space with each comparison.'
      },
      {
        id: 'q2-2',
        testId: 'test-cs-ch2',
        text: 'Which data structure is best suited for implementing a recursive function?',
        options: [
          'Queue',
          'Stack',
          'Linked List',
          'Array'
        ],
        correctAnswer: 1,
        explanation: 'A Stack is used for recursion because it follows LIFO (Last In, First Out), which matches the call stack behavior of recursive functions.'
      },
      {
        id: 'q2-3',
        testId: 'test-cs-ch2',
        text: 'What is the worst-case time complexity of bubble sort?',
        options: [
          'O(n)',
          'O(n log n)',
          'O(n²)',
          'O(log n)'
        ],
        correctAnswer: 2,
        explanation: 'Bubble sort has O(n²) worst-case time complexity because it requires nested iterations through the array.'
      },
      {
        id: 'q2-4',
        testId: 'test-cs-ch2',
        text: 'In a linked list, each node contains:',
        options: [
          'Only data',
          'Data and index',
          'Data and a pointer to the next node',
          'Only a pointer'
        ],
        correctAnswer: 2,
        explanation: 'Each node in a linked list contains data and a pointer (reference) to the next node in the sequence.'
      },
      {
        id: 'q2-5',
        testId: 'test-cs-ch2',
        text: 'Which traversal method visits the root node first, then left subtree, then right subtree?',
        options: [
          'Inorder',
          'Preorder',
          'Postorder',
          'Level-order'
        ],
        correctAnswer: 1,
        explanation: 'Preorder traversal visits: Root → Left Subtree → Right Subtree.'
      },
      {
        id: 'q2-6',
        testId: 'test-cs-ch2',
        text: 'What is a hash table used for?',
        options: [
          'Sorting data',
          'Fast data retrieval using key-value pairs',
          'Graph traversal',
          'Memory allocation'
        ],
        correctAnswer: 1,
        explanation: 'A hash table provides fast data retrieval (average O(1)) by mapping keys to values using a hash function.'
      },
      {
        id: 'q2-7',
        testId: 'test-cs-ch2',
        text: 'Which sorting algorithm is considered the most efficient for general-purpose sorting?',
        options: [
          'Bubble Sort',
          'Selection Sort',
          'Merge Sort',
          'Insertion Sort'
        ],
        correctAnswer: 2,
        explanation: 'Merge Sort has O(n log n) time complexity in all cases and is considered one of the most efficient general-purpose sorting algorithms.'
      },
      {
        id: 'q2-8',
        testId: 'test-cs-ch2',
        text: 'What is the space complexity of an array of n elements?',
        options: [
          'O(1)',
          'O(log n)',
          'O(n)',
          'O(n²)'
        ],
        correctAnswer: 2,
        explanation: 'An array of n elements requires O(n) space as it stores n elements in contiguous memory locations.'
      },
      {
        id: 'q2-9',
        testId: 'test-cs-ch2',
        text: 'Which data structure follows LIFO (Last In, First Out)?',
        options: [
          'Queue',
          'Stack',
          'Deque',
          'Priority Queue'
        ],
        correctAnswer: 1,
        explanation: 'A Stack follows LIFO — the last element pushed is the first one to be popped.'
      },
      {
        id: 'q2-10',
        testId: 'test-cs-ch2',
        text: 'What is the primary advantage of a doubly linked list over a singly linked list?',
        options: [
          'Uses less memory',
          'Can be traversed in both directions',
          'Faster insertion at the beginning',
          'Simpler implementation'
        ],
        correctAnswer: 1,
        explanation: 'A doubly linked list has pointers to both the next and previous nodes, allowing bidirectional traversal.'
      }
    ]
  },
  {
    id: 'test-cs-ch3',
    title: 'Computer Science — Chapter 3',
    slug: 'computer-science-chapter-3',
    description: 'Networking fundamentals, protocols, and internet architecture.',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'q3-1',
        testId: 'test-cs-ch3',
        text: 'How many layers are in the OSI model?',
        options: [
          '5',
          '6',
          '7',
          '8'
        ],
        correctAnswer: 2,
        explanation: 'The OSI (Open Systems Interconnection) model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.'
      },
      {
        id: 'q3-2',
        testId: 'test-cs-ch3',
        text: 'Which protocol is used for secure web communication?',
        options: [
          'HTTP',
          'FTP',
          'HTTPS',
          'SMTP'
        ],
        correctAnswer: 2,
        explanation: 'HTTPS (HyperText Transfer Protocol Secure) uses SSL/TLS encryption for secure web communication.'
      },
      {
        id: 'q3-3',
        testId: 'test-cs-ch3',
        text: 'What does DNS do?',
        options: [
          'Encrypts data',
          'Translates domain names to IP addresses',
          'Routes packets between networks',
          'Assigns IP addresses to devices'
        ],
        correctAnswer: 1,
        explanation: 'DNS (Domain Name System) translates human-readable domain names (like google.com) into IP addresses that computers use to communicate.'
      },
      {
        id: 'q3-4',
        testId: 'test-cs-ch3',
        text: 'Which layer of the TCP/IP model is responsible for routing?',
        options: [
          'Application Layer',
          'Transport Layer',
          'Internet Layer',
          'Network Access Layer'
        ],
        correctAnswer: 2,
        explanation: 'The Internet Layer (also called Network Layer in OSI) is responsible for routing packets across networks using IP addresses.'
      },
      {
        id: 'q3-5',
        testId: 'test-cs-ch3',
        text: 'What is the default port number for HTTP?',
        options: [
          '21',
          '25',
          '80',
          '443'
        ],
        correctAnswer: 2,
        explanation: 'HTTP uses port 80 by default. HTTPS uses port 443.'
      },
      {
        id: 'q3-6',
        testId: 'test-cs-ch3',
        text: 'Which device operates at the Data Link layer?',
        options: [
          'Hub',
          'Switch',
          'Router',
          'Gateway'
        ],
        correctAnswer: 1,
        explanation: 'A Switch operates at the Data Link layer (Layer 2) and uses MAC addresses to forward data frames.'
      },
      {
        id: 'q3-7',
        testId: 'test-cs-ch3',
        text: 'What type of network covers a large geographical area?',
        options: [
          'LAN',
          'PAN',
          'WAN',
          'MAN'
        ],
        correctAnswer: 2,
        explanation: 'A WAN (Wide Area Network) covers large geographical areas, such as countries or continents. The Internet is the largest WAN.'
      },
      {
        id: 'q3-8',
        testId: 'test-cs-ch3',
        text: 'Which protocol is connection-oriented?',
        options: [
          'UDP',
          'TCP',
          'ICMP',
          'ARP'
        ],
        correctAnswer: 1,
        explanation: 'TCP (Transmission Control Protocol) is connection-oriented, establishing a connection before data transfer and ensuring reliable delivery.'
      },
      {
        id: 'q3-9',
        testId: 'test-cs-ch3',
        text: 'What is the purpose of a firewall?',
        options: [
          'Speed up internet connection',
          'Monitor and control network traffic based on security rules',
          'Store website data',
          'Compress files for faster transfer'
        ],
        correctAnswer: 1,
        explanation: 'A firewall monitors and controls incoming and outgoing network traffic based on predetermined security rules.'
      },
      {
        id: 'q3-10',
        testId: 'test-cs-ch3',
        text: 'What does the acronym DHCP stand for?',
        options: [
          'Dynamic Host Configuration Protocol',
          'Digital Host Connection Protocol',
          'Data Handling Control Protocol',
          'Direct Host Communication Protocol'
        ],
        correctAnswer: 0,
        explanation: 'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses and network configuration to devices on a network.'
      }
    ]
  }
];
