<?php
    require_once __DIR__.'/require.php';
    function readCategoryData(){
        $structuredCatObject    =   array();
        $allCatStructureObject  =   array();
        $mainCategoryObject =   array();
        $catData    =   array();
        $catData    =   DB_Read(array('Table'=>'categoryinfo','Fields'=>'catId,catName,parentCat,anchorVideoId','clause'=>'status ='.CATS_VERIFIED.' and anchorVideoId != 0'),'ASSOC','','catId');
        $categoryId_level   =   array();
        $category_level =   1;
        
        $max_category_Level_allowed =   SUBCAT_LEVEL;
        if($catData){
            foreach($catData as $key => $value){
                if($value['parentCat'] == 0){
                    $categoryId_level[$value['catId']]  =   1;
                    array_push($mainCategoryObject,array('label'=>$value['catName'],'link'=>'search/category='.$value['catId'],'attr'=>array('data-catid'=>$value['catId'],'data-vidid'=>$value['anchorVideoId'])));
                }
                else{
                    $category_level =   intval($categoryId_level[$value['parentCat']]) + 1;
                    $categoryId_level[$value['catId']]  =   $category_level;
                    if($category_level <= $max_category_Level_allowed) {
                        if(!isset($structuredCatObject[$value['parentCat']])){
                            $structuredCatObject[$value['parentCat']]   =   array();
                        }
                        array_push($structuredCatObject[$value['parentCat']],array('label'=>$value['catName'],'link'=>'search/category='.$value['catId'],'attr'=>array('data-catid'=>$key,'data-vidid'=>$value['anchorVideoId'])));
                    }
                    if(!isset($allCatStructureObject[$value['parentCat']])){
                        $allCatStructureObject[$value['parentCat']]   =   array();
                    }
                    array_push($allCatStructureObject[$value['parentCat']],array('label'=>$value['catName'],'link'=>'search/category='.$value['catId'],'attr'=>array('data-catid'=>$key,'data-vidid'=>$value['anchorVideoId'])));
                }
            }
            $jsonContent    =           json_encode(array('main' => $mainCategoryObject,'structure'=>$structuredCatObject,'completeCatStructure'=>$allCatStructureObject));

            $menuDataFile   =   $jsonContent;
            $filename   =   __DIR__.'/php/categoryDump.php';
            if(!file_exists($filename))
                file_put_contents($filename, "\n");
            file_put_contents($filename,$menuDataFile);
        }
    }
    readCategoryData();
?>