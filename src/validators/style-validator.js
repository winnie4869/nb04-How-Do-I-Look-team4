import { z } from 'zod';

// 스타일 게시글 생성을 위한 Zod 스키마
export const styleSchema = z.object({
  nickname: z.string().min(1, '닉네임은 필수 항목입니다.'),
  title: z.string().min(1, '제목은 필수 항목입니다.'),
  content: z.string().min(1, '내용은 필수 항목입니다.'),
  password: z.string()
    .min(8, '비밀번호는 8자리 이상이어야 합니다.')
    .max(16, '비밀번호는 16자리 이하여야 합니다.')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/, '비밀번호는 영문과 숫자의 조합으로 8~16자여야 합니다.'),
  categories: z.record(
    z.string().min(1),
    z.object({
      name: z.string().min(1, '상품명은 필수입니다.'),
      brand: z.string().min(1, '브랜드명은 필수입니다.'),
      price: z.number().int().nonnegative('가격은 0 이상의 정수여야 합니다.'),
    })
  )
  .superRefine((data, ctx) => {
    // categories 객체의 키 개수를 확인하여 최소 1개 이상인지 검사
    if (Object.keys(data).length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '카테고리는 최소 1개 이상이어야 합니다.',
        path: ['categories'],
      });
    }
  }),
  tags: z.array(z.string().min(1, '태그는 1자 이상이어야 합니다.')).min(1, '태그는 최소 1개 이상이어야 합니다.').max(3, '태그는 최대 3개까지 가능합니다.'),
  imageUrls: z.array(z.string().url('유효한 URL이어야 합니다.')).min(1, '이미지는 필수 항목입니다.'),
});

// 게시글 수정/삭제 시 비밀번호 확인을 위한 Zod 스키마
export const passwordSchema = z.object({
  password: z.string().min(1, '비밀번호는 필수 항목입니다.'),
});

// URL 경로 매개변수 유효성 검사 스키마
export const styleIdSchema = z.object({
  styleId: z.coerce.number().int().positive('스타일 ID는 양의 정수여야 합니다.'),
});
