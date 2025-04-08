<template>
  <div class="upload-box">
    <el-upload
      :id="uuid"
      action="#"
      :class="['upload', self_disabled ? 'disabled' : '', drag ? 'no-border' : '']"
      :multiple="false"
      :disabled="self_disabled"
      :show-file-list="false"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :drag="drag"
      :accept="fileType.join(',')"
    >
      <template v-if="imageUrl">
        <img :src="imageUrl" class="upload-image" />
        <div class="upload-handle" @click.stop>
          <div v-if="!self_disabled" class="handle-icon" @click="editImg">
            <el-icon><Edit /></el-icon>
            <span>编辑</span>
          </div>
          <div class="handle-icon" @click="imgViewVisible = true">
            <el-icon><ZoomIn /></el-icon>
            <span>查看</span>
          </div>
          <div v-if="!self_disabled" class="handle-icon" @click="deleteImg">
            <el-icon><Delete /></el-icon>
            <span>删除</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="upload-empty">
          <slot name="empty">
            <el-icon><Plus /></el-icon>
          </slot>
        </div>
      </template>
    </el-upload>
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
    <el-image-viewer v-if="imgViewVisible" :url-list="[imageUrl]" @close="imgViewVisible = false" />
  </div>
</template>

<script setup lang="ts" name="UploadImg">
import { ref, computed, inject } from "vue";
import { generateUUID } from "@/utils";
import { uploadImg } from "@/api/modules/upload";
import { ElNotification, formContextKey, formItemContextKey } from "element-plus";
import type { UploadProps, UploadRequestOptions } from "element-plus";

interface UploadFileProps {
  imageUrl: string; // 图片地址 ==> 必传，
  api?: (params: any) => Promise<any>; // 上传图片的 api 方法，默认为 uploadImg
  drag?: boolean; // 是否支持拖拽上传，默认为 true
  disabled?: boolean; // 是否禁用上传组件，默认为 false
  fileSize?: number; // 图片大小限制，默认为 5M
  fileType?: File.ImageMimeType[]; // 图片类型限制，默认为 ["image/jpeg", "image/png", "image/gif"]
  height?: string; // 组件高度，默认为 150px
  width?: string; // 组件宽度，默认为 150px
  borderRadius?: string; // 组件边框圆角，默认为 8px
}

// 默认值配置
const defaultConfig = {
  title: "温馨提示",
  sizeExceedMessage: (size: number) => `上传图片大小不能超过 ${size}M！`,
  typeErrorMessage: "上传图片不符合所需的格式！",
  successMessage: "图片上传成功！",
  errorMessage: "图片上传失败，请您重新上传！"
};

// 接受父组件参数
const props = withDefaults(defineProps<UploadFileProps>(), {
  imageUrl: undefined, // 允许 undefined 作为默认值
  drag: true,
  disabled: false,
  fileSize: 5,
  fileType: () => ["image/jpeg", "image/png", "image/gif"],
  height: "150px",
  width: "150px",
  borderRadius: "8px"
});

// 生成唯一 ID 并缓存
const uuid = ref("id-" + generateUUID());

// 查看图片
const imgViewVisible = ref(false);

// 获取 el-form 和 el-form-item 上下文
const formContext = inject(formContextKey, void 0);
const formItemContext = inject(formItemContextKey, void 0);

// 禁用状态计算
const self_disabled = computed(() => props.disabled || formContext?.disabled);

// 文件类型和大小校验
const isValidFileType = (type: string) => props.fileType.includes(type as File.ImageMimeType);
const isValidFileSize = (size: number) => size / 1024 / 1024 < props.fileSize;

/**
 * @description 图片上传
 */
const emit = defineEmits<{
  "update:imageUrl": [value: string];
}>();

const handleHttpUpload = async (options: UploadRequestOptions) => {
  const api = props.api ?? uploadImg;
  if (typeof api !== "function") {
    console.error("Invalid API function provided.");
    return;
  }

  const formData = new FormData();
  formData.append("file", options.file);

  try {
    const { data } = await api(formData);
    emit("update:imageUrl", data.fileUrl);
    formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
  } catch (error) {
    options.onError(error as any);
  }
};

/**
 * @description 删除图片
 */
const deleteImg = () => {
  emit("update:imageUrl", "");
};

/**
 * @description 编辑图片
 */
const editImg = () => {
  const input = document.querySelector<HTMLInputElement>(`#${uuid.value} .el-upload__input`);
  input?.click();
};

/**
 * @description 文件上传之前判断
 */
const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  const imgSize = isValidFileSize(rawFile.size);
  const imgType = isValidFileType(rawFile.type);

  if (!imgType) {
    ElNotification({
      title: defaultConfig.title,
      message: defaultConfig.typeErrorMessage,
      type: "warning"
    });
  }

  if (!imgSize) {
    ElNotification({
      title: defaultConfig.title,
      message: defaultConfig.sizeExceedMessage(props.fileSize),
      type: "warning"
    });
  }

  return imgType && imgSize;
};

/**
 * @description 图片上传成功
 */
const uploadSuccess = () => {
  ElNotification({
    title: defaultConfig.title,
    message: defaultConfig.successMessage,
    type: "success"
  });
};

/**
 * @description 图片上传错误
 */
const uploadError = () => {
  ElNotification({
    title: defaultConfig.title,
    message: defaultConfig.errorMessage,
    type: "error"
  });
};
</script>

<style scoped lang="scss">
.is-error {
  .upload {
    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;
      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}
:deep(.disabled) {
  .el-upload,
  .el-upload-dragger {
    cursor: not-allowed !important;
    background: var(--el-disabled-bg-color);
    border: 1px dashed var(--el-border-color-darker) !important;
    &:hover {
      border: 1px dashed var(--el-border-color-darker) !important;
    }
  }
}
.upload-box {
  .no-border {
    :deep(.el-upload) {
      border: none !important;
    }
  }
  :deep(.upload) {
    .el-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: v-bind(width);
      height: v-bind(height);
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderRadius);
      transition: var(--el-transition-duration-fast);
      &:hover {
        border-color: var(--el-color-primary);
        .upload-handle {
          opacity: 1;
        }
      }
      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        background-color: transparent;
        border: 1px dashed var(--el-border-color-darker);
        border-radius: v-bind(borderRadius);
        &:hover {
          border: 1px dashed var(--el-color-primary);
        }
      }
      .el-upload-dragger.is-dragover {
        background-color: var(--el-color-primary-light-9);
        border: 2px dashed var(--el-color-primary) !important;
      }
      .upload-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .upload-empty {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 30px;
        color: var(--el-color-info);
        .el-icon {
          font-size: 28px;
          color: var(--el-text-color-secondary);
        }
      }
      .upload-handle {
        position: absolute;
        top: 0;
        right: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: rgb(0 0 0 / 60%);
        opacity: 0;
        transition: var(--el-transition-duration-fast);
        .handle-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 6%;
          color: aliceblue;
          .el-icon {
            margin-bottom: 40%;
            font-size: 130%;
            line-height: 130%;
          }
          span {
            font-size: 85%;
            line-height: 85%;
          }
        }
      }
    }
  }
  .el-upload__tip {
    line-height: 18px;
    text-align: center;
  }
}
</style>
