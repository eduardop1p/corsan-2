import z from 'zod';

import validationCNPJ from '@/services/validationCNPJ';
import validationCPF from '@/services/validationCPF';

export const zodSchema = z.object({
  idDocument: z
    .string()
    .trim()
    .min(1, 'Campo obrigatório')
    .check(ctx => {
      if (ctx.value.length < 15 && !validationCPF(ctx.value)) {
        ctx.issues.push({
          code: 'custom',
          message: `CPF inválido`,
          input: ctx.value,
        });
      } else if (ctx.value.length > 14 && !validationCNPJ(ctx.value)) {
        ctx.issues.push({
          code: 'custom',
          message: `CNPJ inválido`,
          input: ctx.value,
        });
      }
    }),
  registration: z.string().trim().min(1, 'Campo obrigatório'),
});

export type BodyProtocol = z.infer<typeof zodSchema>;
