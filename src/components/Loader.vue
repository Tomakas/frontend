<template>
    <div class="e-loader__container">
        <div class="e-loader static"></div>
        <div class="e-loader animated"></div>
    </div>
</template>

<style>
    .e-loader__container {
        position: absolute;
        width: 60px;
        height: 60px;
        top: 60px;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }

    .e-loader {
        width: 40px;
        height: 40px;
        border: 10px solid;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left:0;
    }

    .e-loader.animated {
        border-color:#DBDB6C transparent transparent;
        animation:spin 1s linear infinite;
    }

    .e-loader.static {
        border-color:#F4F4F4;
    }

    @keyframes spin {
        0% {
            transform:rotate(0deg);
            border-color:#DBDB6C transparent transparent;
        }
        38% {
            transform:rotate(120deg);
            border-color: #6EC1E4 transparent transparent;
        }
        61% {
            transform:rotate(240deg);
            border-color: #6EDB80 transparent transparent;
        }
        100% {
            transform:rotate(360deg);
            border-color:#DBDB6C transparent transparent;
        }
    }
</style>