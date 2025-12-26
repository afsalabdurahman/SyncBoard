[33mcommit a1dc66ce7f1fdb8c6cbd1e8f40632b9c17525c94[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mTiket[m[33m, [m[1;31morigin/Tiket[m[33m)[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Dec 19 11:01:04 2025 +0530

    fix superAdmin layout

[33mcommit 0cd1c2febf4168f3aef8e8fe13dceb057dac129a[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Dec 19 01:41:01 2025 +0530

    feat:Removed_dummy_datas

[33mcommit 20baf46cacbad52b66477ea0b414601bde3b11fc[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Dec 18 11:41:36 2025 +0530

    feat:pagination added_in_superadmin_users,workspace,subscriptions

[33mcommit ba9888d77948f917c8d5402f585a6d3061ed1e99[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Dec 5 14:22:12 2025 +0530

    feat : Ticket implemented

[33mcommit 8796193a8b9c4723aaccf1df49799108b275f635[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Tue Dec 2 21:11:14 2025 +0530

    feat:Ui updated in Super-Tickets

[33mcommit 81c79d2a99df671a43bd00bcd346ce4b82f3946e[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sun Nov 30 18:08:16 2025 +0530

    feat:update superadmin ticket ui

[33mcommit 75b13b5963fd6268a5bcaf4a7f9d7935cbb692c4[m[33m ([m[1;32mfeature[m[33m)[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Nov 27 18:50:59 2025 +0530

    feat: add ticket raising system

[33mcommit e8a24a83d8554b9b15115ef1480417501eea0a5d[m[33m ([m[1;31morigin/feature[m[33m)[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Nov 22 19:44:07 2025 +0530

    fix: bring back client/public folder (was wrongly ignored)

[33mcommit 242bd7fea04aa47af05622fa27cbece00e23a11b[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Nov 22 19:41:41 2025 +0530

    chore: remove uploads and logs from repo

[33mcommit ed271286ba47bd191fde254980522aa95004268a[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Nov 22 19:19:08 2025 +0530

    chore: remove uploads and logs from repo

[33mcommit f25c3d73cd789c194c9808810bc6bde3ac637c5f[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Nov 22 18:56:28 2025 +0530

    chore: improve and clean .gitignore

[33mcommit 2c4d1841c9ef8dad8559bff9a4b4a83a802bfb76[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Nov 22 18:49:26 2025 +0530

    chore: improve and clean .gitignore

[33mcommit 6d51e77283f060e92b856df077e73a1b8f6318ac[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Nov 22 17:06:55 2025 +0530

    chore: .gitIgnore

[33mcommit c5f1678fd3c8f4a2e6145fa4e7f9b06e954f250a[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Nov 22 14:33:54 2025 +0530

    fix:merge-conflict

[33mcommit 3c412c6da5efbf5bc78a2151c2697e628b86b87b[m
Merge: e7b1bc9 fd24ac0
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Nov 22 13:24:43 2025 +0530

    Merge branch 'rag' into feature
    
    # Conflicts:
    #       Server/node_modules/.package-lock.json
    #       Server/package-lock.json
    #       Server/package.json
    #       Server/src/application/dto/ProjectDTOs.ts
    #       Server/src/application/dto/WorkspaceDTOs.ts
    #       Server/src/application/mappers/TaskMapper.ts
    #       Server/src/application/repositories/iworkspace/IWorkspace.ts
    #       Server/src/application/use-cases/project/ProjectUsecase.ts
    #       Server/src/application/use-cases/task/TaskUsecase.ts
    #       Server/src/application/use-cases/workspace/CreateWorkspaceUsecase.ts
    #       Server/src/domain/entities/Project.ts
    #       Server/src/domain/entities/Task.ts
    #       Server/src/infrastructure/config/Di/TsyringConfig.ts
    #       Server/src/infrastructure/config/env.config.ts
    #       Server/src/infrastructure/database/models/ProjectModel.ts
    #       Server/src/infrastructure/database/models/TaskModel.ts
    #       Server/src/presentation/controllers/project/ProjectController.ts
    #       Server/src/presentation/controllers/workspace/Workspacecontroller.ts
    #       Server/src/presentation/routes/workspaceRoutes.ts
    #       Server/src/server.ts
    #       Server/src/types/workpaceTypes.ts
    #       Server/src/utils/dateCoverter.ts
    #       client/src/SuperAdmin/Layout/Layout.tsx
    #       client/src/SuperAdmin/pages/Analytic.tsx
    #       client/src/SuperAdmin/pages/Subscription.tsx
    #       client/src/SuperAdmin/pages/Users.tsx
    #       client/src/Worksapce/apis/workspaceapis.ts
    #       client/src/Worksapce/components/SubSideMenu.tsx
    #       client/src/Worksapce/hooks/workspacehooks.ts
    #       client/src/Worksapce/pages/WorkSpacePage.tsx

[33mcommit fd24ac06fd8b9d6459044c34ce50537d1da565ab[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Nov 21 15:11:24 2025 +0530

    fix:RAG search

[33mcommit 099161a6851f983dcf4072701e1dba28a8bf2c6a[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Nov 20 00:21:07 2025 +0530

    feat: RAG task part is completed

[33mcommit 67834998bf8ecd6a2b79e7dad2541243463c0e80[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Nov 14 11:30:04 2025 +0530

    feat:Add types for entities

[33mcommit e7b1bc91f0a2519119872b814b1b41d18add1857[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Nov 13 15:16:07 2025 +0530

    fix: super_admin_subscription_layout

[33mcommit 27d48cfb42f0a5784d7f97b7ef2c375e036406cd[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Nov 13 15:16:07 2025 +0530

    fix: super_admin_subscription_layout

[33mcommit d940d4aeb06a77c7ec1a69d95eaf284dce9c1b24[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Oct 30 01:01:50 2025 +0530

    fix:Remove Stripe secret key and use environment variable

[33mcommit 60ea4c4e142678160e2fab1fe4627d91f7de83bc[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Oct 30 01:01:50 2025 +0530

    fix:Remove Stripe secret key and use environment variable

[33mcommit 00a81fd199b8f8215c42e4421d694d980b2ef55a[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Oct 30 00:42:58 2025 +0530

    fix:upload validation

[33mcommit a02a79793bfc6d735a3b817df0d32a646242b256[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Oct 30 00:42:58 2025 +0530

    fix:upload validation

[33mcommit 9f8c02c58bc5bb34ba358a7cf0df69c652c596b2[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Oct 29 19:15:06 2025 +0530

    feat:add payment status page

[33mcommit 656d5e48c722f5ea6fda86ff14eb694d7ed2acb7[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Oct 29 19:15:06 2025 +0530

    feat:add payment status page

[33mcommit b8b1b4f045a5b55ef965c0a3760eda2eda80df2c[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Tue Oct 28 17:49:34 2025 +0530

    fix:redux api call

[33mcommit 278850ca69078d003165e2a64bdc0a4e893f4ea6[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Tue Oct 28 17:49:34 2025 +0530

    fix:redux api call

[33mcommit c7122e4eb6352cb643a5203035f050c6cd6152a8[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Oct 24 22:10:48 2025 +0530

    feat:update project and task

[33mcommit b446e21f31f5859f0f03fdc1bd1bee8ac0272035[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Oct 24 22:10:48 2025 +0530

    feat:update project and task

[33mcommit 3dceaa95289001155f2c592e5c471e5a1c58eb3a[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Oct 16 14:37:16 2025 +0530

    fix bug

[33mcommit 4e61ce737f6e7d04831519d2fe868a040e94e7c0[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Oct 16 14:37:16 2025 +0530

    fix bug

[33mcommit 39a91d4e0bff1f7c9d1aaf555033a6d5107fed67[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Oct 11 13:00:35 2025 +0530

    fix:BaseRepository

[33mcommit 8c54f6c995c37a1b36ba368ef519fb491d645e2a[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Oct 11 13:00:35 2025 +0530

    fix:BaseRepository

[33mcommit bdcaa9896464ecc47ea14e45ac824fa22d6f71a8[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Mon Oct 6 20:44:04 2025 +0530

    feat: update project structure

[33mcommit a335129100d7ae2c11de78f05a5e07d9ebe54680[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Mon Oct 6 20:44:04 2025 +0530

    feat: update project structure

[33mcommit 50ffc90eb8199dcff1f9ab0df4ccf84b6e014711[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Oct 2 21:31:12 2025 +0530

    fix bug into suscription

[33mcommit 68d6e3ec61b3ab5718322fce43f2514d76678163[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Oct 2 21:31:12 2025 +0530

    fix bug into suscription

[33mcommit 059df877b0c9a87a8511c05f7f9dfc670634360d[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Oct 1 23:51:06 2025 +0530

    Implimented stripe webhook

[33mcommit f01ea056d959985ca7baa84eb475e3716f54bf05[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Oct 1 23:51:06 2025 +0530

    Implimented stripe webhook

[33mcommit 6124ec989ec110a5efd2c9c7aee52e73c8302dd2[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Sep 27 22:40:36 2025 +0530

    fix stripe bug

[33mcommit 7a9e8d4c1aa0d9163f02a7252fa51f1606210770[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Sep 27 22:40:36 2025 +0530

    fix stripe bug

[33mcommit 97f72d18af4f7f974eefe2cb464b5caab63d12c3[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Sep 27 18:30:50 2025 +0530

    feat: add suscription

[33mcommit d879d6ab39ed1064f47e53fe1605b2cfc6a00c6a[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Sep 27 18:30:50 2025 +0530

    feat: add suscription

[33mcommit 11fc7c018708c7655e24f2fe3520c12302eb571e[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Sep 26 18:19:05 2025 +0530

    merge: resolve conflicts and commit changes

[33mcommit f34d63a91a00f5d593cf8cc7bfd64ce963fa37ed[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Sep 26 18:19:05 2025 +0530

    merge: resolve conflicts and commit changes

[33mcommit 673caecb63af6d83c664773d05f9c80389f369ee[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Sep 26 17:36:36 2025 +0530

    merge: resolve conflicts and commit changes

[33mcommit 804936956dfa1a02619d7966784201c4b4101574[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Sep 26 17:36:36 2025 +0530

    merge: resolve conflicts and commit changes

[33mcommit 29d656b2a5f46a56c6128c5dbb732de9982e5fdb[m
Merge: a3b59b6 b431eb9
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Sep 26 14:52:02 2025 +0530

    merge(feature/DTO): integrate dto functionality into dev"

[33mcommit 62a0b27e21941c7ceb72ae9b7a317fced62c9ed1[m
Merge: ca8eb14 5f32db7
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Sep 26 14:52:02 2025 +0530

    merge(feature/DTO): integrate dto functionality into dev"

[33mcommit b431eb95994f969be4f8cc57282d145784fed4d6[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Sep 26 12:51:30 2025 +0530

    fix(DTO): Task

[33mcommit 5f32db7f52304ee640d411547850783f44188191[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Sep 26 12:51:30 2025 +0530

    fix(DTO): Task

[33mcommit 7faf8b5f013cbf1fa4465d7e4aa45fa01c175bf1[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Sep 26 12:45:36 2025 +0530

    fix(DTO): Task

[33mcommit 5d8f2d825f3bfec113307bfc06b204fad58cc798[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Sep 26 12:45:36 2025 +0530

    fix(DTO): Task

[33mcommit 21c81cfb3433bd77e2c3a411e285a975db308df2[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Sep 25 20:55:24 2025 +0530

    feat(user-dto): add UserRequest and UserResponse DTOs

[33mcommit 598e7bee6109402cd03f1ebd11e7457fd558e62a[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Sep 25 20:55:24 2025 +0530

    feat(user-dto): add UserRequest and UserResponse DTOs

[33mcommit a3b59b6ca29ac950537e0b82bfcada359cc48fa4[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Mon Sep 22 12:52:31 2025 +0530

    feat(subscription): add subscription module

[33mcommit ca8eb143c412e6b3548aee99dd7333a31993492e[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Mon Sep 22 12:52:31 2025 +0530

    feat(subscription): add subscription module

[33mcommit 7dfe1973f8bb896ab2b503b949c2d3744f4f5a02[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Sep 18 18:59:54 2025 +0530

    fix(upload): payment gateway

[33mcommit d2bb31fa2dc28cf6a8a5b70eee0cb35a138bdf68[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Thu Sep 18 18:59:54 2025 +0530

    fix(upload): payment gateway

[33mcommit baab9a56c6169a16f1e8f876b30c03f1406df3bf[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Sep 17 17:35:09 2025 +0530

    feat(ui): update subscription page layout for improved clarity

[33mcommit d43ed4180471fec61c6eab9b190f5b2fa89c7768[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Sep 17 17:35:09 2025 +0530

    feat(ui): update subscription page layout for improved clarity

[33mcommit 3bf8b2d6ba33af9257b747311d0d0eed50dfc938[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Aug 20 20:51:26 2025 +0530

    chore:package.json

[33mcommit 126d16721400a31be6be63629e5c722a1b7d0fe6[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Aug 20 20:51:26 2025 +0530

    chore:package.json

[33mcommit 934d79df947455a66ab8ad57cc2edf9a76bd1243[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Aug 20 20:03:27 2025 +0530

    chore: add TypeScript build setup and verify build output

[33mcommit d693764069b13e794d559556945b31b528f9b668[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Aug 20 20:03:27 2025 +0530

    chore: add TypeScript build setup and verify build output

[33mcommit bf7ba880ebf3832672603632324ad54710c9d730[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Mon Sep 15 11:12:33 2025 +0530

    fix(upload): correct image upload URL handling

[33mcommit 7410d73a74ce2e61bf34fd27d4a20134bc1febd8[m[33m ([m[1;32mmain[m[33m, [m[1;32mlog[m[33m)[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Mon Sep 15 11:12:33 2025 +0530

    fix(upload): correct image upload URL handling

[33mcommit bd5f18dacfa0cbd0449408d3f9fc1de01e2a9516[m[33m ([m[1;31morigin/main[m[33m)[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Aug 20 20:51:26 2025 +0530

    chore:package.json

[33mcommit f6fbd8d98cf14eb1c1ee94240d0418e135ee7ffa[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Aug 20 20:51:26 2025 +0530

    chore:package.json

[33mcommit 82b55423fa0a340b79ee8941c1b374fb2f0fca32[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Aug 20 20:03:27 2025 +0530

    chore: add TypeScript build setup and verify build output

[33mcommit a3bfa039929282ccea9fad5607441779d3b9e9bb[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Aug 20 20:03:27 2025 +0530

    chore: add TypeScript build setup and verify build output

[33mcommit f11075ff0e25b9e87ed6676cd9079fe33e9cd9a1[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Aug 20 19:10:45 2025 +0530

    refactor(infrastructure): update repository implementation

[33mcommit ff85bff0017e1467a2a51501bafd8aaf32032eaf[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Aug 20 19:10:45 2025 +0530

    refactor(infrastructure): update repository implementation

[33mcommit c21e1dab90aa7368c1a40a2413a457fd1f3578d5[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Mon Aug 11 20:36:36 2025 +0530

    fix(tasks): resolve multiple bugs in task management and UI
    
    - Fixed issues in task use cases, repositories, and models
    - Updated API controllers and routes for consistent task handling
    - Corrected UI rendering in Kanban board, project details, and dashboard
    - Added new components: TaskApproval and alertBox
    - Introduced dateConverter utility

[33mcommit 11ac03d3b23bacda016c7f9fa2f51f52703e473f[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Mon Aug 11 20:36:36 2025 +0530

    fix(tasks): resolve multiple bugs in task management and UI
    
    - Fixed issues in task use cases, repositories, and models
    - Updated API controllers and routes for consistent task handling
    - Corrected UI rendering in Kanban board, project details, and dashboard
    - Added new components: TaskApproval and alertBox
    - Introduced dateConverter utility

[33mcommit 30e53478dad85a834a1b04eac76c2932689a6a9c[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Aug 6 21:07:51 2025 +0530

    feat(frontend): implement activity logs UI, refactor Redux slices, and enhance project and invitation components

[33mcommit 343e0abfdbe600ad20f5ea660fb92f0b3ac9ae95[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Aug 6 21:07:51 2025 +0530

    feat(frontend): implement activity logs UI, refactor Redux slices, and enhance project and invitation components

[33mcommit c436e3782d80f4aa11fb647c23e286c30e68bf32[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Aug 6 21:03:08 2025 +0530

    feat: implement activity logs and update workspace, project, and member modules

[33mcommit 55d7aa3f5278843a4d54a7178dcc0694c589eecd[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Aug 6 21:03:08 2025 +0530

    feat: implement activity logs and update workspace, project, and member modules

[33mcommit d34086ef8628aceda450a01b3241bed21e52d2a0[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sun Aug 3 21:46:13 2025 +0530

    feat: implement abstraction layer and update business logic

[33mcommit 53dba5cbd5e001ec24e883d1a525247c460b3af8[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sun Aug 3 21:46:13 2025 +0530

    feat: implement abstraction layer and update business logic

[33mcommit 6c0cb54801d820b872c0ff2bbbaa9a859ff9ec47[m
Author: Afsalabdurahman KP <108572262+afsalabdurahman@users.noreply.github.com>
Date:   Sun Aug 3 17:17:36 2025 +0530

    Update README.md

[33mcommit cc1629d59f3aa900aaaecc72d2dd36b3b396887e[m
Author: Afsalabdurahman KP <108572262+afsalabdurahman@users.noreply.github.com>
Date:   Sun Aug 3 17:17:36 2025 +0530

    Update README.md

[33mcommit ddb02a4ee43a757a1cd41dabe34a5b81df25fd77[m
Author: Afsalabdurahman KP <108572262+afsalabdurahman@users.noreply.github.com>
Date:   Sun Aug 3 17:16:28 2025 +0530

    Update README.md

[33mcommit 9a62cda2ec8c08ec477d9a8b631209fe1e79572e[m
Author: Afsalabdurahman KP <108572262+afsalabdurahman@users.noreply.github.com>
Date:   Sun Aug 3 17:16:28 2025 +0530

    Update README.md

[33mcommit 718bbfe605a5433a507bf51beef0d74b72e3d42e[m
Author: Afsalabdurahman KP <108572262+afsalabdurahman@users.noreply.github.com>
Date:   Sun Aug 3 17:15:46 2025 +0530

    Create README.md

[33mcommit 499d769125689ce2e5fb6c3b1409fa51a50d0f2e[m
Author: Afsalabdurahman KP <108572262+afsalabdurahman@users.noreply.github.com>
Date:   Sun Aug 3 17:15:46 2025 +0530

    Create README.md

[33mcommit b794720019dfb6bd3cff42e2611a99712f2cb204[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Aug 2 21:39:54 2025 +0530

    chore: remove .env file from git and add to .gitignore

[33mcommit 5c7945401c70826e400062c2eb877334cd84e504[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Aug 2 21:23:16 2025 +0530

    chore(api): update endpoint for task fetching

[33mcommit 58799a495d5a90ef3492e0a5e401e24614a0463f[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sat Aug 2 20:34:18 2025 +0530

    chore: add client folder and integrate frontend setup

[33mcommit 84a3ad2d727287f1b73803b666b596c99b2e11ff[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Aug 1 10:56:49 2025 +0530

    socket connection fixed

[33mcommit 932d06c401cc2bc7592e4825a09e5610061814d0[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Wed Jul 30 14:25:45 2025 +0530

    RAC completed

[33mcommit fc762a786bb4440da7f349dd2c8028f49e29e976[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Fri Jul 18 17:53:39 2025 +0530

    Jwt Verification is completed

[33mcommit fcf37d4c39941b13669f853d0285a6871467d6df[m
Author: Afsal kp <afsalkp4343@gmail.com>
Date:   Sun Jul 13 20:20:54 2025 +0530

    fix the bug in auth
