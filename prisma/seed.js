// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('스타일 시드 데이터 생성을 시작합니다.');

//   // 기존에 데이터가 있으면 삭제 (선택 사항)
//   await prisma.style.deleteMany({});

//   // 스타일 데이터 생성 (여기에 thumbnail 필드 추가)
//   const styles = [
//     {
//       thumbnail: 'minimalism_thumb.jpg',
//       title: '미니멀리즘 스타일',
//       content: '깨끗하고 단순한 미니멀리즘 스타일입니다.',
//       nickname: 'admin',
//       password: 'password123',
//       viewCount: 0,
//       curationCount: 0
//     },
//     {
//       thumbnail: 'vintage_thumb.jpg',
//       title: '빈티지 스타일',
//       content: '클래식한 빈티지 스타일입니다.',
//       nickname: 'admin',
//       password: 'password123',
//       viewCount: 0,
//       curationCount: 0
//     },
//     {
//       thumbnail: 'street_thumb.jpg',
//       title: '스트릿 스타일',
//       content: '힙하고 자유로운 스트릿 스타일입니다.',
//       nickname: 'admin',
//       password: 'password123',
//       viewCount: 0,
//       curationCount: 0
//     },
//     {
//       thumbnail: 'office_thumb.jpg',
//       title: '오피스룩 스타일',
//       content: '단정하고 세련된 오피스룩입니다.',
//       nickname: 'admin',
//       password: 'password123',
//       viewCount: 0,
//       curationCount: 0
//     },
//     {
//       thumbnail: 'casual_thumb.jpg',
//       title: '캐주얼 스타일',
//       content: '편안하고 일상적인 캐주얼 스타일입니다.',
//       nickname: 'admin',
//       password: 'password123',
//       viewCount: 0,
//       curationCount: 0
//     },
//     {
//       thumbnail: 'sporty_thumb.jpg',
//       title: '스포티 스타일',
//       content: '활동적인 스포티 스타일입니다.',
//       nickname: 'admin',
//       password: 'password123',
//       viewCount: 0,
//       curationCount: 0
//     },
//   ];
//   // createMany를 사용해서 한 번에 여러 데이터 생성
//   await prisma.style.createMany({
//     data: styles,
//     skipDuplicates: true, // 중복된 레코드는 건너뛰기
//   });

//   console.log('스타일 시드 데이터 생성이 완료되었습니다.');
// }

//  main()
//     .catch((e) => {
//       console.error(e);
//       process.exit(1);
//     })
//     .finally(async () => {
//       await prisma.$disconnect();
//     });