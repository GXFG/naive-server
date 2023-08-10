import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// @ApiUseTags('截图')
export class ScreenshotDto {
  @ApiProperty({
    description: '页面地址',
    type: String,
    example: 'http://m.baidu.com',
  })
  @IsNotEmpty({ message: 'url不能为空' })
  url: string;

  @ApiProperty({
    description: '设备类型',
    enum: ['h5', 'pc'],
    default: 'h5',
    type: String,
  })
  @IsOptional()
  device?: 'h5' | 'pc' | 'custom';

  @IsOptional()
  width?: '750';

  @IsOptional()
  height?: '1334';

  @IsOptional()
  type?: 'jpg' | 'pdf';

  @IsOptional()
  format?:
    | 'letter'
    | 'legal'
    | 'tabloid'
    | 'ledger'
    | 'a0'
    | 'a1'
    | 'a2'
    | 'a3'
    | 'a4'
    | 'a5'
    | 'a6';

  @ApiProperty({
    description: 'pdf缩放比例，between `0.1` and `2`.',
    default: '1',
    type: String,
  })
  @IsOptional()
  scale?: string; // between `0.1` and `2`.

  @ApiProperty({
    description: '图片质量',
    minimum: 0,
    maximum: 100,
    default: 60,
    type: Number,
  })
  @IsOptional()
  quality?: string | number;

  @ApiProperty({
    description: '是否由框架自动判断加载状态开始截图: "1" | "0"',
    default: '1',
    type: String,
  })
  @IsOptional()
  autocontrol?: '0' | '1';
}
