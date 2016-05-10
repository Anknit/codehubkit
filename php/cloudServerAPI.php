<?php
/*
* Author: Aditya
* date: 08-Aug-2014
* CSS Document 
*
*/
?>
<?php
	function cloudServersAPICredentials(){
		return array(
			'username'	=>	'aditya.dev',
			'apiKey'	=>	'7d8ef4d0cde349908be572dc8e6649a9'	
		);
	}
	
	class cloudServersAPI {
		private $serviceProvider	=	'rackspace';
		private	$rackspaceConfig	=	array(
			'endPointUrl'	=>	'https://identity.api.rackspacecloud.com/v2.0/tokens'	//For authentication
		);
		private	$serverRegions	=	array(	//Available for rackspace. These can be used for server locations
			/* 0 */'DFW',//(Dallas-Fort Worth, TX, US)
			/* 1 */'HKG',//(Hong Kong, China)
			/* 2 */'IAD',//(Blacksburg, VA, US)
			/* 3 */'LON',//(London, England)
			/* 4 */'SYD',//(Sydney, Australia)
		);
		
		//below parameters are not required.
		public	$userName	=	'aditya.dev';
		public	$apiKey		=	'7d8ef4d0cde349908be572dc8e6649a9';
		public	$password	=	'qweASD123';
		
		
		public $serverImages	=	array (	//Operating systems
			0	=>	array (
				'id'	=>	'fb4601c0-6424-4006-93bd-e4086b2f575b',
				'name'	=>	'CoreOS (Stable)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/fb4601c0-6424-4006-93bd-e4086b2f575b',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			1	=>	array (
				'id'	=>	'4af31fdf-948b-46b0-bb61-bb3121d44242',
				'name'	=>	'CoreOS (Beta)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/4af31fdf-948b-46b0-bb61-bb3121d44242',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			2	=>	array (
				'id'	=>	'28555e09-5639-43f9-b64b-9c98c78520ad',
				'name'	=>	'CoreOS (Alpha)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/28555e09-5639-43f9-b64b-9c98c78520ad',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			3	=>	array (
				'id'	=>	'456d369b-8173-489d-88ed-4520727a13a8',
				'name'	=>	'FreeBSD 10 (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/456d369b-8173-489d-88ed-4520727a13a8',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			4	=>	array (
				'id'	=>	'daae8ce0-b23c-440b-91da-6dc85dc687db',
				'name'	=>	'NovaController_Ben',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/daae8ce0-b23c-440b-91da-6dc85dc687db',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	40,
				'minRam'	=>	1024
			),
			5	=>	array (
				'id'	=>	'5ea78462-07b7-4cd1-8961-cb3dde4c9218',
				'name'	=>	'Debian Unstable (Sid) (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/5ea78462-07b7-4cd1-8961-cb3dde4c9218',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			6	=>	array (
				'id'	=>	'654e19d8-8203-4f63-b700-8e8ee39a529a',
				'name'	=>	'Scientific Linux 6 (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/654e19d8-8203-4f63-b700-8e8ee39a529a',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			7	=>	array (
				'id'	=>	'e09ad6af-114d-40f7-8f70-652b61d1bbbc',
				'name'	=>	'Ubuntu 14.04 LTS (Trusty Tahr) (PV)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/e09ad6af-114d-40f7-8f70-652b61d1bbbc',
				'OS-DCF:diskConfig'	=>	'AUTO',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			8	=>	array (
				'id'	=>	'6455fff1-1f0e-46e3-a795-6c88738d7280',
				'name'	=>	'CentOS 7 (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/6455fff1-1f0e-46e3-a795-6c88738d7280',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
		
			),
			9	=>	array (
				'id'	=>	"fa26666f-b71b-492e-8bd9-d29eabc5b49f",
				'name'	=>	'Ubuntu 15.04 (Vivid Vervet) (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/fa26666f-b71b-492e-8bd9-d29eabc5b49f',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			10	=>	array (
				'id'	=>	'33f0f56f-a9d2-4ffc-843f-94b80860f2c1',
				'name'	=>	'Gentoo 15.2 (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/33f0f56f-a9d2-4ffc-843f-94b80860f2c1',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			11	=>	array (
				'id'	=>	'1e2617c5-643a-4a1f-b8c0-60b2cca50d7f',
				'name'	=>	'Scientific Linux 7 (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/1e2617c5-643a-4a1f-b8c0-60b2cca50d7f',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			12	=>	array (
				'id'	=>	'f423dfe6-5d39-4f99-88a0-dd6f4bdc5ec2',
				'name'	=>	'Arch 2015.6 (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/f423dfe6-5d39-4f99-88a0-dd6f4bdc5ec2',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			13	=>	array (
				'id'	=>	'02394517-2ee5-4dc4-a5d2-b006456f9c0f',
				'name'	=>	'OpenSUSE 13.2 (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/02394517-2ee5-4dc4-a5d2-b006456f9c0f',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			14	=>	array (
				'id'	=>	'c07409c8-0931-40e4-a3bc-4869ecb5931e',
				'name'	=>	'Red Hat Enterprise Linux 7 (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/c07409c8-0931-40e4-a3bc-4869ecb5931e',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			15	=>	array (
				'id'	=>	'd6503db8-726d-4087-93b6-26a68ff92ac0',
				'name'	=>	'Red Hat Enterprise Linux 6 (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/d6503db8-726d-4087-93b6-26a68ff92ac0',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			16	=>	array (
				'id'	=>	'1e74625d-d3fe-4c35-9d1e-086335938843',
				'name'	=>	'Red Hat Enterprise Linux 6 (PV)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/1e74625d-d3fe-4c35-9d1e-086335938843',
				'OS-DCF:diskConfig'	=>	'AUTO',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			17	=>	array (
				'id'	=>	'9ea458ba-88b4-4220-8d9e-a80a76d706eb',
				'name'	=>	'Fedora 21 (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/9ea458ba-88b4-4220-8d9e-a80a76d706eb',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			18	=>	array (
				'id'	=>	'fe0dfc22-7ccf-4dc3-84c9-25f275bc3fe8',
				'name'	=>	'Fedora 22 (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/fe0dfc22-7ccf-4dc3-84c9-25f275bc3fe8',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			19	=>	array (
				'id'	=>	'6af6b3fe-5920-422b-82ed-ffdd7154017b',
				'name'	=>	'Red Hat Enterprise Linux 5 (PV)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/6af6b3fe-5920-422b-82ed-ffdd7154017b',
				'OS-DCF:diskConfig'	=>	'AUTO',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			20	=>	array (
				'id'	=>	'757ef937-74c1-4a93-a921-1495da1026aa',
				'name'	=>	'Debian Testing (Stretch) (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/757ef937-74c1-4a93-a921-1495da1026aa',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			21	=>	array (
				'id'	=>	'93168d07-a754-4c16-84f7-911c4781f4bd',
				'name'	=>	'Ubuntu 12.04 LTS (Precise Pangolin) (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/93168d07-a754-4c16-84f7-911c4781f4bd',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			22	=>	array (
				'id'	=>	'93346217-ef91-4983-803e-2027891d1cdb',
				'name'	=>	'Debian 8 (Jessie) (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/93346217-ef91-4983-803e-2027891d1cdb',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			23	=>	array (
				'id'	=>	'ba1dfeaf-0bf1-4315-823a-d49de7778938',
				'name'	=>	'Ubuntu 12.04 LTS (Precise Pangolin) (PV)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/ba1dfeaf-0bf1-4315-823a-d49de7778938',
				'OS-DCF:diskConfig'	=>	'AUTO',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			24	=>	array (
				'id'	=>	'4edfbf70-cb04-4658-a00e-527beed978b4',
				'name'	=>	'Debian 7 (Wheezy) (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/4edfbf70-cb04-4658-a00e-527beed978b4',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			25	=>	array (
				'id'	=>	'28153eac-1bae-4039-8d9f-f8b513241efe',
				'name'	=>	'Ubuntu 14.04 LTS (Trusty Tahr) (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/28153eac-1bae-4039-8d9f-f8b513241efe',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			26	=>	array (
				'id'	=>	'e5575e1a-a519-4e21-9a6b-41207833bd39',
				'name'	=>	'CentOS 6 (PVHVM)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/e5575e1a-a519-4e21-9a6b-41207833bd39',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			27	=>	array (
				'id'	=>	'465121a4-2986-4c84-99b5-132caf187f01',
				'name'	=>	'CentOS 6 (PV)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/465121a4-2986-4c84-99b5-132caf187f01',
				'OS-DCF:diskConfig'	=>	'AUTO',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			28	=>	array (
				'id'	=>	'a3f80f02-813b-4160-8608-179389c1ffbd',
				'name'	=>	'CentOS 5 (PV)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/a3f80f02-813b-4160-8608-179389c1ffbd',
				'OS-DCF:diskConfig'	=>	'AUTO',
				'minDisk'	=>	20,
				'minRam'	=>	512
			),
			29	=>	array (
				'id'	=>	'2b0ebb8f-c3fd-4677-8abe-583fae74778a',
				'name'	=>	'Windows Server 2012 + SQL Server 2012 SP1 Web',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/2b0ebb8f-c3fd-4677-8abe-583fae74778a',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	40,
				'minRam'	=>	2048
			),
			30	=>	array (
				'id'	=>	'4d6707f0-abed-4a25-b900-47ebaed69f24',
				'name'	=>	'Windows Server 2012 + SQL Server 2012 SP1 Standard',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/4d6707f0-abed-4a25-b900-47ebaed69f24',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	40,
				'minRam'	=>	2048
			),
			31	=>	array (
				'id'	=>	'abb67d66-94b6-4a91-a234-6b1a952fd60b',
				'name'	=>	'Windows Server 2008 R2 SP1 + SQL Server 2008 R2 SP2 Web',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/abb67d66-94b6-4a91-a234-6b1a952fd60b',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	40,
				'minRam'	=>	2048
			),
			32	=>	array (
				'id'	=>	'a6fc998a-f4ba-4613-8bf1-5afa51d4474d',
				'name'	=>	'Windows Server 2008 R2 SP1 + SQL Server 2008 R2 SP2 Standard',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/a6fc998a-f4ba-4613-8bf1-5afa51d4474d',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	40,
				'minRam'	=>	2048
			),
			33	=>	array (
				'id'	=>	'cbb2aff3-77d9-448e-9c63-157aaef5a28e',
				'name'	=>	'Windows Server 2012',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/cbb2aff3-77d9-448e-9c63-157aaef5a28e',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	40,
				'minRam'	=>	1024
			),
			34	=>	array (
				'id'	=>	'ce1fa266-3914-4ffd-83f3-97d0e34fc9cb',
				'name'	=>	'Windows Server 2008 R2 SP1',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/ce1fa266-3914-4ffd-83f3-97d0e34fc9cb',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	40,
				'minRam'	=>	1024
			),
			35	=>	array (
				'id'	=>	'e788cfc4-a2ec-4f0d-bce2-6dd961dc7899',
				'name'	=>	'Windows Server 2012 R2 + SQL Server 2014 Standard',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/e788cfc4-a2ec-4f0d-bce2-6dd961dc7899',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	40,
				'minRam'	=>	2048
			),
			36	=>	array (
				'id'	=>	'5109f615-adcc-44ac-9a8e-7697d07d7d28',
				'name'	=>	'Windows Server 2012 R2 + SQL Server 2014 Web',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/5109f615-adcc-44ac-9a8e-7697d07d7d28',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	40,
				'minRam'	=>	2048
			),
			37	=>	array (
				'id'	=>	'e3caa20a-ab9a-48ee-a0c6-02561806616d',
				'name'	=>	'Windows Server 2012 R2',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/e3caa20a-ab9a-48ee-a0c6-02561806616d',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	40,
				'minRam'	=>	1024
			),
			38	=>	array (
				'id'	=>	'07c16842-db34-449a-90ac-e8f05dd8564e',
				'name'	=>	'Vyatta Network OS 6.7R6',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/07c16842-db34-449a-90ac-e8f05dd8564e',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	20,
				'minRam'	=>	1024
			),
			39	=>	array (
				'id'	=>	'4ada7bca-cf0a-479c-9fa8-1cecc9bfd15d',
				'name'	=>	'Media Server2',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/4ada7bca-cf0a-479c-9fa8-1cecc9bfd15d',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	40,
				'minRam'	=>	1024
			),
			40	=>	array (
				'id'	=>	'2fb9bf1b-be3d-4955-82d2-c255b062cbd6',
				'name'	=>	'AppServer2',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/2fb9bf1b-be3d-4955-82d2-c255b062cbd6',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	40,
				'minRam'	=>	1024
			),
			41	=>	array (
				'id'	=>	'9aa0d346-c06f-4652-bbb1-4342a7d2d017',
				'name'	=>	'iPXE Boot (boot.rackspace.com)',
				'status'=>	'ACTIVE',
				'href'	=>	'https://dfw.servers.api.rackspacecloud.com/v2/889551/images/9aa0d346-c06f-4652-bbb1-4342a7d2d017',
				'OS-DCF:diskConfig'	=>	'MANUAL',
				'minDisk'	=>	0,
				'minRam'	=>	0
			)
		);	  
				
		//private $serverFloavorHrefV2	=	"https://dfw.servers.api.rackspacecloud.com/v2/889551/servers";
		private $serverFlavors	=	array(	//Server Flavors for hardware infrastructure
			2=>	'2',				//"name": "512MB Standard Instance"
			3=>	'3',				//"name": "1GB Standard Instance"
			4=>	'4',				//"name": "2GB Standard Instance"
			5=>	'5',				//"name": "4GB Standard Instance"
			6=>	'6',				//"name": "8GB Standard Instance"
			7=>	'7',				//"name": "15GB Standard Instance"
			8=>	'8',				//"name": "30GB Standard Instance"
			9=>	'compute1-15',		//"name": "15 GB Compute v1"
			10=>'compute1-30',		//"name": "30 GB Compute v1"
			11=>'compute1-4',		//"name": "4 GB Compute v1"
			12=>'compute1-60',		//"name": "60 GB Compute v1"
			13=>'compute1-8',		//"name": "8 GB Compute v1"
			14=>'general1-1',		//"name": "1 GB General Purpose v1"
			15=>'general1-2',		//"name": "2 GB General Purpose v1"
			16=>'general1-4',		//"name": "4 GB General Purpose v1"
			17=>'general1-8',		//"name": "8 GB General Purpose v1"
			18=>'io1-120',			//"name": "120 GB I/O v1"
			19=>'io1-15',			//"name": "15 GB I/O v1"
			20=>'io1-30',			//"name": "30 GB I/O v1"
			21=>'io1-60',			//"name": "60 GB I/O v1"
			22=>'io1-90',			//"name": "90 GB I/O v1"
			23=>'memory1-120',		//"name": "120 GB Memory v1"
			24=>'memory1-15',		//"name": "15 GB Memory v1"
			25=>'memory1-240',		//"name": "240 GB Memory v1"
			26=>'memory1-30',		//"name": "30 GB Memory v1"
			27=>'memory1-60',		//"name": "60 GB Memory v1"
			28=>'performance1-1',	//"name": "1 GB Performance"
			29=>'performance1-2',	//"name": "2 GB Performance"
			30=>'performance1-4',	//"name": "4 GB Performance"
			31=>'performance1-8',	//"name": "8 GB Performance"
			32=>'performance2-120',	//"name": "120 GB Performance"
			33=>'performance2-15',	//"name": "15 GB Performance"
			34=>'performance2-30',	//"name": "30 GB Performance"
			35=>'performance2-60',	//"name": "60 GB Performance"
			36=>'performance2-90'	//"name": "90 GB Performance"
		);
		
		private function getAPIurl ($region) {
			return 'https://'.$region.'.servers.api.rackspacecloud.com/v2' ;
		}
		// This Method Creates Server Details Object
		private function createServerDetailsObject($serverParsedResponse){
			$ServerDetails	=	array();
			$ServerDetails['id']		=	$serverParsedResponse['id'];
			$ServerDetails['link']		=	$serverParsedResponse['links'][0]['href'];
			$ServerDetails['name']		=	$serverParsedResponse['name'];
			if(isset($serverParsedResponse['progress'])){
				$ServerDetails['Progress']	=	$serverParsedResponse['progress'];
			}
			$ServerDetails['Status']	=	$serverParsedResponse['status'];
			$ServerDetails['Created']	=	$serverParsedResponse['created'];
			$ServerDetails['UserID']	=	$serverParsedResponse['user_id'];
			$ServerDetails['TenantID']	=	$serverParsedResponse['tenant_id'];
			$ServerDetails['HostID']	=	$serverParsedResponse['hostId'];
			$ServerDetails['ImageID']	=	$serverParsedResponse['image']['id'];
			$ServerDetails['ImageLink']=	$serverParsedResponse['image']['links'][0]['href'];
			$ipv4 = '';
			if(isset($serverParsedResponse['addresses']['public'])){
				$serverPubAddressArr	=	$serverParsedResponse['addresses']['public'];
				foreach($serverPubAddressArr as $key => $value){
					if($value['version'] == 4){
						$ipv4	=	$value['addr'];
						break;
					}
				}
			}
			$ServerDetails['Address']	=	$ipv4;
			$ServerDetails['Flavor']	=	array('id'	=>	$serverParsedResponse['flavor']['id'], 'link'	=>	$serverParsedResponse['flavor']['links'][0]['href']);
		
			return $ServerDetails;
		}
		//==========================================SERVER METHODS DEFINED BELOW====================================================//
		/**
		*	Description: Constructor function. This will initialize the service provider which will be used for further calls.
		*	@param	:	serviceProvider : Optional. Possible values: 'rackspace'. The default value will be 'rackspace'. //In future amazon could be added.
		*/
		public function cloudServersAPI($serviceProvider	=	'rackspace'){
			$this->serviceProvider	=	'rackspace';			
		}
		
		/**		
		
			NAME: ****************	AUTHENTICATION	***************
		
		
		*	Description: Generates the valid token required for further service provider calls.
		
		*	@param	Mandatory. Associative array with following keys and their value.
		
				username : Mandatory. The username to use for authentication.
				password : The password to use for authentication.	
				apiKey	 : The account key to use for authentication.
			
				***	Either of apiKey and Password are required/mandatory.
		
		*	return	{
				'status'		:	'success/error' or '1/0',	This doesnot represents the success/failure of rackspace action
				'userName'		:	'cloud service userName',	rackspace user name
				'RackspaceUserID':	'cloud service userID',		rackspaceUserID
				'TokenID'		:	'TokenID',			//required for further calls' This is like the session ID.
				'TokenExpiry'	:	'Expiry date and time of token',
				'TenantID'		:	'accountID'			//required for further calls' Rackspace account ID
				'ServerResponse':	'Complete server response recieved as JSON'. This may be required to store for other details or verification at later stages.
			}
		*/
		public function cloudServerAuthentication($params){
				$config		=	$this->rackspaceConfig;	//When Amazon support will be added, just enhance the config, if request structure is same.
				
				$key	=	'apiKey';
				if(isset($params['password'])){
					$key	=	'password';
				}
				$keysForRequest	=	array(
					'password'	=>	'passwordCredentials',
					'apiKey'	=>	'RAX-KSKEY:apiKeyCredentials'
				);
				
				$authenticateRequest	=	array(
					'auth'	=>	array(
						$keysForRequest[$key]	=>	array(
							'username'	=>	$params['username'],
							$key		=>	$params[$key],
						)
					),
				);
				
				$options = array(
					'http' => array(
						'header'  => "Content-type: application/json\r\n",
						'method'  => 'POST',
						'content' => json_encode($authenticateRequest),
					),
				);
				
				$url			=	$config['endPointUrl'];
				$serverResponse	=	$this->sendRequest($options, $url);

				$output	=	array(
					'status'	=>	0
				);
				if($serverResponse != '' && $serverResponse != NULL){
					$serverParsedResponse	=	json_decode($serverResponse, true);
					if(isset($serverParsedResponse['access'])){	/** Validate if the access key exists in response code, Fill in the output array*/
						$output['status']			=	1;
						$output['RackspaceUserID']	=	$serverParsedResponse['access']['user']['id'];
						$output['userName']			=	$serverParsedResponse['access']['user']['name'];
						$output['TokenID']			=	$serverParsedResponse['access']['token']['id'];
						$output['TokenExpiry']		=	$serverParsedResponse['access']['token']['expires'];
						$output['TenantID']			=	$serverParsedResponse['access']['token']['tenant']['id'];
						$output['ServerResponse']	=	$serverResponse;
					}
				}
				
				return $output;
		}
		
		/**		
		
			NAME: ****************	LIST IMAGES	***************
		
		
		*	Description: Generates the List of images available for use at rackspace location.
		
		*	@param	Mandatory. Associative array with following keys and their value.
		
				TokenID 		: Mandatory. THE token ID recieved in authentication output. If the token has expired, new token should be generated from authentication method
				TenantID 		: Mandatory. THE TenantID ID/Account ID recieved in authentication output
				ServerLocation	: Mandatory. The Location of service providers data center to form endpoint url for REST request.	
			
		
		*	return	{
				'status'		:	'success/error' or '1/0',	This doesnot represents the success/failure of rackspace action
				'Images'		:	array(	Indexed array of arrays
					array(
						id		:	'',	Unique ID of the image present at a rackspace region. This will be same across the regions
						link	:	'Latest(API v2) link/url of the image',
						name	:	'', Name of the image
						minDisk	:	'May or may not be available. If not then value will be 0',
						minRam	:	'May or may not be available. If not then value will be 0'
					)
				),
				'ServerResponse':	'Complete server response recieved as JSON'. This may be required to store for other details or verification at later stages.
			}
		*/
		public function cloudServerImages($params){
			$token	=	$params['TokenID'];
			$options = array(
				'http' => array(
					'header'  => "X-Auth-Token: $token\r\n",
				),
			);

			$account		=	$params['TenantID'];
			
			$url			=	$this->getAPIurl($params['ServerLocation'])."/$account/images/detail";
			$serverResponse	=	$this->sendRequest($options, $url);

			$output	=	array(
				'status'	=>	0
			);
			if($serverResponse != '' && $serverResponse != NULL){
				$serverParsedResponse	=	json_decode($serverResponse, true);
				if(isset($serverParsedResponse['images'])){	/** Validate if the access key exists in response code, Fill in the output array*/
					
					//Prepare Essential information of images in an array
					$ImageInfo	=	array();
					for($i = 0; $i < count($serverParsedResponse['images']); $i++){
						$ImageInfo[$i]['id']		=	$serverParsedResponse['images'][$i]['id'];
						$ImageInfo[$i]['link']		=	$serverParsedResponse['images'][$i]['links'][0]['href'];
						$ImageInfo[$i]['name']		=	$serverParsedResponse['images'][$i]['name'];
						$ImageInfo[$i]['minDisk']	=	$serverParsedResponse['images'][$i]['minDisk'];
						$ImageInfo[$i]['minRam']	=	$serverParsedResponse['images'][$i]['minRam'];
					}
					
					$output['status']			=	1;
					$output['Images']			=	$ImageInfo;
					$output['ServerResponse']	=	$serverResponse;
				}
			}
			
			return $output;
		}
		
		/**		
		
			NAME: ****************	LIST SERVERS FLAVORS	***************
		
		
		*	Description: Generates the List of server flavors available for use at rackspace location.
		
		*	@param	Mandatory. Associative array with following keys and their value.
		
				TokenID 		: Mandatory. THE token ID recieved in authentication output. If the token has expired, new token should be generated from authentication method
				TenantID 		: Mandatory. THE TenantID ID/Account ID recieved in authentication output
				ServerLocation	: Mandatory. The Location of service providers data center to form endpoint url for REST request.	
			
		
		*	return	{
				'status'		:	'success/error' or '1/0',	This doesnot represents the success/failure of rackspace action
				'Flavors'		:	array(	Indexed array of arrays
					array(
						id		:	'',	Unique ID of the server flavors(configuration) present at a rackspace region. This will be same across the regions
						link	:	'Latest(API v2) link/url of the flavor',
						name	:	'', Name of the configuration
					)
				),
				'ServerResponse':	'Complete server response recieved as JSON'. This may be required to store for other details or verification at later stages.
			}
		*/
		public function cloudServerFlavors($params){
			$token	=	$params['TokenID'];
			$options = array(
				'http' => array(
					'header'  => "X-Auth-Token: $token\r\n",
				),
			);

			$account		=	$params['TenantID'];
			
			$url			=	$this->getAPIurl($params['ServerLocation'])."/$account/flavors";
			$serverResponse	=	$this->sendRequest($options, $url);

			$output	=	array(
				'status'	=>	0
			);
			if($serverResponse != '' && $serverResponse != NULL){
				$serverParsedResponse	=	json_decode($serverResponse, true);
				if(isset($serverParsedResponse['flavors'])){	/** Validate if the access key exists in response code, Fill in the output array*/
					
					//Prepare Essential information of flavors in an array
					$FlavorInfo	=	array();
					for($i = 0; $i < count($serverParsedResponse['flavors']); $i++){
						$FlavorInfo[$i]['id']		=	$serverParsedResponse['flavors'][$i]['id'];
						$FlavorInfo[$i]['link']		=	$serverParsedResponse['flavors'][$i]['links'][0]['href'];
						$FlavorInfo[$i]['name']		=	$serverParsedResponse['flavors'][$i]['name'];
					}
					
					$output['status']			=	1;
					$output['Flavors']			=	$FlavorInfo;
					$output['ServerResponse']	=	$serverResponse;
				}
			}
			
			return $output;
		}
		
		/**		
		
			NAME: ****************	LIST SERVERS	***************
		
		
		*	Description: Generates the List of servers at rackspace location.
		
		*	@param	Mandatory. Associative array with following keys and their value.
		
				TokenID 		: Mandatory. THE token ID recieved in authentication output. If the token has expired, new token should be generated from authentication method
				TenantID 		: Mandatory. THE TenantID ID/Account ID recieved in authentication output
				ServerLocation	: Mandatory. THE Location of service providers data center to form endpoint url for REST request.	
				Filters			: Optional. THE Filters can be applied to shortlist desired servers by passing parmeters all of which are optional.
					array(
						'Limit'		:	'', Integer. Limit the number of output servers data.
						'ImageID'	:	'',	Servers created using this image id will be listed
						'FlavourID'	:	'',	Servers created using this Flavor will be listed
						'Name'		:	'', Server name check
						'Status'	:	'',	Server Status values
						'Changed'	:	'', The changes-since date-time. The list will show servers that have been deleted since the changes-since time. 
						'AutoImage'	:	'',	The servers that have image backup scheduled will be listed. RAXSI: image_schedule = boolean.
					)
			
		
		*	return	{
				'status'		:	'success/error' or '1/0',	This doesnot represents the success/failure of rackspace action
				'Servers'		:	array(	Assoc array of arrays. The key will be server ID.
					array(
						id			:	'',	Unique ID of the server.
						link		:	'Latest(API v2) link/url of the server',
						name		:	'server name. This is the custom value provided as a parmater while creating a server'
						Progress	:	Optional. '', This is a integer that marks the progress(%) of building a server. 
						Status		:	'', String value may be BUILD or ACTIVE or may be ERROR, if it happens to be. Since creating a server takes some time, server details could be called to check if server is ACTIVE.
						UserID		:	''	Rackspace USER ID who created the server.
						TenantID	:	'',	Rackspace Account ID
						HostID		:	'',	These servers are themself virtual but run on some host. So here we obtain the hostID.
						ImageID		:	'', The image using which the server was created.
						ImageLink	:	'',	The API v2 link of an image using which the server was created.
						Address		:	'IP v4 address'
						Flavor		:	array(
							'id'	:	'',	Unique ID of the server flavors(configuration) present at a rackspace region using which the server was created. 
							'link'	:	'',	Latest(API v2) link/url of the flavor
						)
					)
				),
				'ServerResponse':	'Complete server response recieved as JSON'. This may be required to store for other details or verification at later stages.
			}
		*/
		public function cloudServerLists($params){
			$token	=	$params['TokenID'];
			$options = array(
				'http' => array(
					'header'  => "X-Auth-Token: $token\r\n",
				),
			);

			$account		=	$params['TenantID'];
			
			/* Prepare filter query string */
			$keysMappedForRequests = array(
				'Limit'		=>	'limit',
				'ImageID'	=>	'imageId',
				'FlavourID'	=>	'flavorId',
				'Name'		=>	'serverName',
				'Status'	=>	'serverStatus',
				'Changed'	=>	'changes-since',
				'AutoImage'	=>	'RAXSI:image_schedule',
			);
			$queryParam =	'';
			if(isset($params['Filters'])){
				foreach($params['Filters'] as $FilterKey => $FilterValue){
					$queryParam .= $queryParam != '' ? '&' : '';
					$queryParam .=	$keysMappedForRequests[$FilterKey].'='.$FilterValue;
				}
					
				$queryParam = $queryParam != '' ? '?'.$queryParam : '';
			}
			
			$url			=	$this->getAPIurl($params['ServerLocation'])."/$account/servers/detail".$queryParam;
			$serverResponse	=	$this->sendRequest($options, $url);

			$output	=	array(
				'status'	=>	0
			);
			if($serverResponse != '' && $serverResponse != NULL){
				$serverParsedResponse	=	json_decode($serverResponse, true);
				if(isset($serverParsedResponse['servers'])){	/** Validate if the access key exists in response code, Fill in the output array*/
					
					//Prepare Essential information of servers in an array
					$ServerDetails	=	array();
					for($i = 0; $i < count($serverParsedResponse['servers']); $i++){
						$id = $serverParsedResponse['servers'][$i]['id'];
						$ServerDetails[$id] = $this->createServerDetailsObject($serverParsedResponse['servers'][$i]);
					}
					
					$output['status']			=	1;
					$output['Servers']			=	$ServerDetails;
					$output['ServerResponse']	=	$serverResponse;
				}
			}
			
			return $output;
		}
		
		/**		
		
			NAME: ****************	SERVER DETAILS	***************
		
		
		*	Description: List the server details of a running server identified by ID
		
		*	@param	Mandatory. Associative array with following keys and their value.
		
				TokenID 		: Mandatory. THE token ID recieved in authentication output. If the token has expired, new token should be generated from authentication method
				TenantID 		: Mandatory. THE TenantID ID/Account ID recieved in authentication output
				ServerLocation	: Mandatory. The Location of service providers data center to form endpoint url for REST request.	
				ServerID		: Mandatory. The SERVER Unique ID. this is generated when a new server is created.
			
		
		*	return	{
				'status'		:	'success/error' or '1/0',	This doesnot represents the success/failure of rackspace action
				'Server'		:	array(	Indexed array of arrays
					id			:	'',	Unique ID of the server.
					link		:	'Latest(API v2) link/url of the server',
					name		:	'server name. This is the custom value provided as a parmater while creating a server'
					Progress	:	Optional. '', This is a integer that marks the progress(%) of building a server. 
					Status		:	'', String value may be BUILD or ACTIVE or may be ERROR, if it happens to be. Since creating a server takes some time, server details could be called to check if server is ACTIVE.
					UserID		:	''	Rackspace USER ID who created the server.
					TenantID	:	'',	Rackspace Account ID
					HostID		:	'',	These servers are themself virtual but run on some host. So here we obtain the hostID.
					ImageID		:	'', The image using which the server was created.
					ImageLink	:	'',	The API v2 link of an image using which the server was created.
					Address		:	'IP v4 address'
					Flavor		:	array(
						'id'	:	'',	Unique ID of the server flavors(configuration) present at a rackspace region using which the server was created. 
						'link'	:	'',	Latest(API v2) link/url of the flavor
					)
				),
				'ServerResponse':	'Complete server response recieved as JSON'. This may be required to store for other details or verification at later stages.
			}
		*/
		public function cloudServerDetails($params){
			$token	=	$params['TokenID'];
			$options = array(
				'http' => array(
					'header'  => "X-Auth-Token: $token\r\n",
				),
			);

			$account		=	$params['TenantID'];
			$serverID		=	$params['ServerID'];

			$url			=	$this->getAPIurl($params['ServerLocation'])."/$account/servers/$serverID";
			$serverResponse	=	$this->sendRequest($options, $url);

			$output	=	array(
				'status'	=>	0
			);
			if($serverResponse != '' && $serverResponse != NULL){
				$serverParsedResponse	=	json_decode($serverResponse, true);
				if(isset($serverParsedResponse['server'])){	/** Validate if the access key exists in response code, Fill in the output array*/
					
					//Prepare Essential information of server in an array
					$ServerDetails = $this->createServerDetailsObject($serverParsedResponse['server']);
					
					$output['status']			=	1;
					$output['Server']			=	$ServerDetails;
					$output['ServerResponse']	=	$serverResponse;
				}
			}
			
			return $output;
		}
		
		/**		
		
			NAME: ****************	CREATE SERVER	***************
		
		
		*	Description: Create and boot a new server
		
		*	@param	Mandatory. Associative array with following keys and their value.
		
				TokenID 		: Mandatory. THE token ID recieved in authentication output. If the token has expired, new token should be generated from authentication method
				TenantID 		: Mandatory. THE TenantID ID/Account ID recieved in authentication output
				ServerLocation	: Mandatory. The Location of service providers data center to form endpoint url for REST request.	
				ServerName		: Mandatory. The Name for server to be created, to identify it in a list.
				ServerFlavorID	: Mandatory. The Flavor ID for server to be created. This basically identifies the infrastructure, and is obtained in LIST Server Flavors API
				ServerMetaData	: Optional. The Meta text for server to be created.
				ImageID			: Mandatory. The unique imageid of operating system to create the server. It could be a backup image ID or a new Operating system image ID as obtained from List Images API
				
			
		
		*	return	{
				'status'		:	'success/error' or '1/0',	This doesnot represents the success/failure of rackspace action
				'Server'		:	array(	Indexed array of arrays
					id			:	'',	Unique ID of the server.
					link		:	'Latest(API v2) link/url of the server',
					Password	:	''	Administrator account password. The username for windows servers will be Administrator and for linux systems will be root.
				),
				'ServerResponse':	'This will be complete server response recieved as JSON'.
			}
		*/
		public function cloudServerCreateServer($params){
			$token			=	$params['TokenID'];
			$account		=	$params['TenantID'];
				
			$inputOptions	=	array(
				'server'	=>	array(
					"name" 		=> $params['ServerName'],
					"imageRef"	=> $params['ImageID'],
					"flavorRef" => $params['ServerFlavorID'],
				)
			);
			if(!empty($params['ServerMetaData'])){
				$inputOptions['metadata']	=	$params['ServerMetaData'];
			}

			$options = array(
				'http' => array(
					'method'  => "POST",
					'content' => json_encode($inputOptions),
					'header'  => "Content-type: application/json\r\n" .
								 "X-Auth-Token: $token\r\n" .
								 "X-Auth-Project-Id: $account\r\n" .
								 "Accept: application/json"
				),
			);

			$url			=	$this->getAPIurl($params['ServerLocation'])."/$account/servers";
			$serverResponse	=	$this->sendRequest($options, $url);

			$output	=	array(
				'status'	=>	0
			);
			if($serverResponse != '' && $serverResponse != NULL){
				$serverParsedResponse	=	json_decode($serverResponse, true);
				if(isset($serverParsedResponse['server'])){	/** Validate if the access key exists in response code, Fill in the output array*/
					
					//Prepare Essential information of flavors in an array
					$ServerDetails	=	array();
					$ServerDetails['id']		=	$serverParsedResponse['server']['id'];
					$ServerDetails['link']		=	$serverParsedResponse['server']['links'][0]['href'];
					$ServerDetails['Password']	=	$serverParsedResponse['server']['adminPass'];
					
					$output['status']			=	1;
					$output['Server']			=	$ServerDetails;
					$output['ServerResponse']	=	$serverResponse;
				}
			}
			
			return $output;
		}
		
		/**		
		
			NAME: ****************	SERVER OPERATIONS	***************
		
		
		*	Description: Action on an existing server which is identified by its ServerID. The actions can be Reboot/Rebuild/Resize/Revert_Resized/Confirm_Resize/Rescue/UnRescue/CreateServerImage/changeadminpass
		
		*	@param	Mandatory. Associative array with following keys and their value.
		
				TokenID 		: Mandatory. THE token ID recieved in authentication output. If the token has expired, new token should be generated from authentication method
				TenantID 		: Mandatory. THE TenantID ID/Account ID recieved in authentication output
				ServerLocation	: Mandatory. The Location of service providers data center to form endpoint url for REST request.	
				ServerID		: Mandatory. The SERVER Unique ID. this is generated when a new server is created.
				OperationName	: Mandatory. The values possible are 	rebuild/resize/backupimage/reboot/revert_resized/confirm_resize/rescue/unrescue/changeadminpass
 				ImageID			: Optional. Mandatory for "rebuild" action/operation.	The unique imageid of operating system to use for the server. It could be a backup image ID or a new Operating system image ID as obtained from List Images API
				ResizeOptions	: Optional. Mandatory for "resize" action/operation.
					array(
						'name'		:	'Name to be used for resized server'
						'ServerFlavorID'	:	'ServerFlavorID'. The Flavor ID to use for server to be resized. This basically identifies the infrastructure, and is obtained in LIST Server Flavors API
					)	
				backupImage		: array(
					'name'		:	'',			Mandatory.
					'metadata'	:	''/array	Optional.	The Meta text for image to be created. If an array is given then it should be an assoc array
				),				: Optional. Mandatory for "backupimage" action/operation.
				RebootType		: Optional. Mandatory for "reboot" action/operation. The possible values are hard/soft.
				NewPassword		: Optional. Mandatory for "changeadminpass" action/operation. The New admin password will be set
		
		*	return	{
				'status'		:	'success/error' or '1/0',	This doesnot represents the success/failure of rackspace action, but for the library. E.g. 1 in case of delete server does not mean that server has been deleted, but that the request has been completed.
			}
		*/
		public function cloudServerOperation($params){
			$token			=	$params['TokenID'];
			$account		=	$params['TenantID'];
			$serverID		=	$params['ServerID'];
			
			$operation		=	strtolower($params['OperationName']);
				
			$inputOptions	=	array();
			switch($operation){
				case 'rebuild':
					$inputOptions['rebuild']	=	array(
						"imageRef" 		=> $params['ImageID'],
						"diskConfig" 	=> "manual"	
					);
				break;
				case 'resize':
					$inputOptions['resize']	=	array(
						"name"			=> $params['ResizeOptions']['name'],
						"flavorRef" 	=> $params['ResizeOptions']['ServerFlavorID']
					);
				break;
				case 'backupimage':
					$inputOptions['createImage']	=	array(
						"name" 		=> $params['backupImage']['name'],	
						"metadata"	=> $params['backupImage']['metadata']
					);
				break;
				case 'reboot':
					$inputOptions['reboot']	=	array(
						"type" 		=> $params['RebootType']
					);
				break;
				case 'revert_resized':
					$inputOptions['revertResize']	=	NULL;
				break;
				case 'confirm_resize':
					$inputOptions['confirmResize']	=	NULL;
				break;
				case 'rescue':
					$inputOptions['rescue']			=	'none';
				break;
				case 'unrescue':
					$inputOptions['unrescue']		=	'none';
				break;
				case 'changeadminpass':
					$inputOptions['changePassword']		=	array(
						"adminPass"	=>	$params['newPassword']
					);
				break;
			}

			$options = array(
				'http' => array(
					'method'  => "POST",
					'content' => json_encode($inputOptions),
					'header'  => "Content-type: application/json\r\n" .
								 "X-Auth-Token: $token\r\n"
				),
			);

			$url			=	$this->getAPIurl($params['ServerLocation'])."/$account/servers/$serverID/action";
			$serverResponse	=	$this->sendRequest($options, $url);

			$output	=	array(
				'status'	=>	1
			);
			
			return $output;
		}

		/**		
		
			NAME: ****************	DELETE SERVER 	***************
		
		
		*	Description: Delete an existing server.
		
		*	@param	Mandatory. Associative array with following keys and their value.
		
				TokenID 		: Mandatory. THE token ID recieved in authentication output. If the token has expired, new token should be generated from authentication method
				TenantID 		: Mandatory. THE TenantID ID/Account ID recieved in authentication output
				ServerLocation	: Mandatory. The Location of service providers data center to form endpoint url for REST request.	
				ServerID		: Mandatory. The SERVER Unique ID. this is generated when a new server is created.
		
		*	return	{
				'status'		:	'success/error' or '1/0',	This doesnot represents the success/failure of rackspace action, but for the library. E.g. 1 in case of delete server does not mean that server has been deleted, but that the request has been completed.
			}
		*/
		public function cloudServerDelete($params){
			$token			=	$params['TokenID'];
			$account		=	$params['TenantID'];
			$serverID		=	$params['ServerID'];
			

			$options = array(
				'http' => array(
					'method'  => "DELETE",
					'header'  => "X-Auth-Token: $token\r\n"
				),
			);

			$url			=	$this->getAPIurl($params['ServerLocation'])."/$account/servers/$serverID";
			$serverResponse	=	$this->sendRequest($options, $url);
			$responseCode	=	http_response_code();
			$output	=	array(
				'status'	=>	0
			);
			if($responseCode == 204 || $responseCode == 200) {
				$output['status']	=	1;
			}
			
			return $output;
		}

		/**		
		
			NAME: ****************	LIST BACKUP IMAGES	***************
		
		
		*	Description: Generates the List of backup images available for use at a rackspace location.
		
		*	@param	Mandatory. Associative array with following keys and their value.
		
				TokenID 		: Mandatory. THE token ID recieved in authentication output. If the token has expired, new token should be generated from authentication method
				ServerLocation	: Mandatory. The Location of service providers data center to form endpoint url for REST request.	
			
		
		*	return	{
				'status'		:	'success/error' or '1/0',	This doesnot represents the success/failure of rackspace action
				'Images'		:	array(	Indexed array of arrays
					array(
						id		:	'',
						link	:	'Latest(API v2) link/url of the image',
						name	:	''
						minDisk	:	'May or may not be available. If not then value will be 0',
						minRam	:	'May or may not be available. If not then value will be 0'
					)
				),
				'ServerResponse':	'This will be complete server response recieved as JSON'.
			}
		*/
		public function cloudServerListbackupImages(){
			$token			=	$params['TokenID'];
			
			$options = array(
				'http' => array(
					'header'  => "X-Auth-Token: $token\r\n"
				),
			);

			$url			=	$this->getAPIurl($params['ServerLocation'])."/images?type=SNAPSHOT";
			$serverResponse	=	$this->sendRequest($options, $url);

			$output	=	array(
				'status'	=>	0
			);
			if($serverResponse != '' && $serverResponse != NULL){
				$serverParsedResponse	=	json_decode($serverResponse, true);
				if(isset($serverParsedResponse['images'])){	/** Validate if the access key exists in response code, Fill in the output array*/
					
					//Prepare Essential information of images in an array
					$ImageInfo	=	array();
					for($i = 0; $i < count($serverParsedResponse['images']); $i++){
						$ImageInfo[$i]['id']		=	$serverParsedResponse['images'][$i]['id'];
						$ImageInfo[$i]['link']		=	$serverParsedResponse['images'][$i]['links'][0]['href'];
						$ImageInfo[$i]['name']		=	$serverParsedResponse['images'][$i]['name'];
						$ImageInfo[$i]['minDisk']	=	$serverParsedResponse['images'][$i]['minDisk'];
						$ImageInfo[$i]['minRam']	=	$serverParsedResponse['images'][$i]['minRam'];
					}
					
					$output['status']			=	1;
					$output['Images']			=	$ImageInfo;
					$output['ServerResponse']	=	$serverResponse;
				}
			}
			
			return $output;
		}

		/**		
		
			NAME: ****************	DELETE IMAGE 	***************
		
		
		*	Description: Delete an existing image.
		
		*	@param	Mandatory. Associative array with following keys and their value.
		
				TokenID 		: Mandatory. THE token ID recieved in authentication output. If the token has expired, new token should be generated from authentication method
				TenantID 		: Mandatory. THE TenantID ID/Account ID recieved in authentication output
				ServerLocation	: Mandatory. The Location of service providers data center to form endpoint url for REST request.	
				ImageID			: Mandatory. The IMAGE Unique ID. this is generated when a new IMAGE is created/backed up.
		
		*	return	{
				'status'		:	'success/error' or '1/0',	This doesnot represents the success/failure of rackspace action, but for the library. E.g. 1 in case of delete server does not mean that server has been deleted, but that the request has been completed.
			}
		*/
		public function cloudServerImageDelete($params){
			$token			=	$params['TokenID'];
			$account		=	$params['TenantID'];
			$imageID		=	$params['ImageID'];
			

			$options = array(
				'http' => array(
					'method'  => "DELETE",
					'content' => json_encode($inputOptions),
					'header'  => "X-Auth-Token: $token\r\n"
				),
			);

			$url			=	$this->getAPIurl($params['ServerLocation'])."/$account/images/$imageID";
			$serverResponse	=	$this->sendRequest($options, $url);

			$output	=	array(
				'status'	=>	1
			);
			
			return $output;
		}
		
		/*
			The method sends the request to remote server. For this the url is picked up from class member variables
			@params	data: Array(
				'Key'=>'Value', 
				'Key1'=>'Value1'
			)
		*/
		private function sendRequest($data = '', $url = ''){
			if(function_exists('sendExternalRequest')){
				$result = sendExternalRequest($data, $url);
			}
			else{
				if(empty($url)) return false;	//NO API URL has been provided
				
				$context  = stream_context_create($data);
				$result = file_get_contents($url, false, $context);
			}
			return $result;
		}
	};
?>